<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Mail\OrderMail;
use App\Orders;
use App\CatalogItems;
use App\CatalogCurrencies;

class OrdersController extends Controller {
  /**
   * Gets paginated list of orders
   *
   * @return mixed Returns paginated list of current page versions by parent
   */

  public function getOrders(Request $request) {
    $orders = Orders::orders();
    $status = $request->input('status', null);

    if ($status !== null) {
      $orders->where('status', $status);
    }

    $orders = $orders->paginate(Orders::getPageSize());

    return response()->json($orders);
  }

  /**
   * Gets order
   *
   * @param string $orderId
   * @return mixed Returns order or 404 status code when
   *               order is not found
   */
  public function getOrder(int $orderId) {
    $order = Orders::order($orderId);

    if (isset($order)) {
      $history = DB::table('order_history')
        ->where('order_id', '=', $orderId)
        ->get();

      $order->history = $history;

      return response()->json($order);
    } else {
      return response('', 404);
    }
  }

  /**
   * Changes order status
   *
   * @param Request $request
   * @param int $orderId
   * @return void Returns 204 status, 405 in case of invalid transition or
   *              404 when order doesn't exist
   */
  public function changeOrderState(Request $request, int $orderId) {
    $newStatus = $request->input('status');
    $silent = (bool) $request->input('silent', 0);
    $order = Orders::order($orderId);

    if (isset($order)) {
      if (
        $order->status === 'NEW' &&
        ($newStatus !== 'ACCEPTED' && $newStatus !== 'REJECTED')
      ) {
        return response('', 405);
      } elseif (
        ($order->status === 'ACCEPTED' || $order->status === 'REJECTED') &&
        $newStatus !== 'CLOSED'
      ) {
        return response('', 405);
      } elseif ($order->status === 'CLOSED' && $newStatus !== 'NEW') {
        return response('', 405);
      } else {
        try {
          DB::transaction(function () use (
            $orderId,
            $order,
            $newStatus,
            $silent
          ) {
            DB::table('orders')
              ->where('id', '=', $orderId)
              ->update([
                'status' => $newStatus,
                'modified_at' => date('Y-m-d H:i:s'),
              ]);

            DB::table('order_history')->insert([
              'order_id' => $orderId,
              'from_status' => $order->status,
              'to_status' => $newStatus,
              'original_private_note' => $order->private_note,
              'new_private_note' => $order->private_note,
            ]);

            $catalogItem = json_decode($order->catalog_item);

            switch ($newStatus) {
              case 'CLOSED':
                if ($order->status === 'ACCEPTED') {
                  DB::table('catalog_items')
                    ->where('id', $catalogItem->id)
                    ->update([
                      'published' => 0,
                      'published_at' => null,
                      'modified_at' => date('Y-m-d H:i:s'),
                      'booked' => 0,
                    ]);
                } else {
                  DB::table('catalog_items')
                    ->where('id', $catalogItem->id)
                    ->update([
                      'published' => 1,
                      'published_at' => date('Y-m-d H:i:s'),
                      'modified_at' => date('Y-m-d H:i:s'),
                      'booked' => 0,
                    ]);
                }
                break;
              case 'NEW':
                DB::table('catalog_items')
                  ->where('id', $catalogItem->id)
                  ->update([
                    'published' => 1,
                    'published_at' => date('Y-m-d H:i:s'),
                    'modified_at' => date('Y-m-d H:i:s'),
                    'booked' => 1,
                  ]);
                break;
              default:
            }

            if ($silent === false) {
              $orderLanguage = json_decode($order->catalog_item)->language;

              try {
                Mail::to('vojtech.v.portes@gmail.com')->send(
                  new OrderMail('ORDER_' . $newStatus, $orderLanguage, $orderId)
                );
              } catch (Throwable $e) {
                response('', 405);
              }
            }
          });

          return response('', 204);
        } catch (Throwable $e) {
          return response('', 405);
        }
      }
    } else {
      return response('', 404);
    }
  }

  /**
   * Changes order note
   *
   * @param Request $request
   * @param int $orderId
   * @return void Returns 204 status code or 404 when order
   *              is not found
   */
  public function changeOrderNote(Request $request, int $orderId) {
    $this->validate($request, [
      'private_note' => 'string',
    ]);

    $order = Orders::order($orderId);

    if (isset($order)) {
      DB::transaction(function () use ($request, $orderId, $order) {
        DB::table('orders')
          ->where('id', '=', $orderId)
          ->update([
            'private_note' => $request->input('private_note', ''),
          ]);

        DB::table('order_history')->insert([
          'order_id' => $orderId,
          'from_status' => $order->status,
          'to_status' => $order->status,
          'original_private_note' => $order->private_note,
          'new_private_note' => $request->input('private_note', ''),
        ]);
      });

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes order
   *
   * @param int $orderId
   * @return void Returns 204 status code or 404 when order
   *              is not found
   */
  public function deleteOrder(int $orderId) {
    $order = Orders::order($navigationId);

    if (isset($order)) {
      DB::transaction(function () use ($orderId) {
        DB::table('orders')
          ->where('id', '=', $orderId)
          ->delete();

        DB::table('order_history')
          ->where('order_id', '=', $orderId)
          ->delete();
      });

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Submits order
   *
   * @param Requset $request
   * @param string $languageCode
   * @param int $catalogItemId
   * @return void Redirects and flashes session with order status
   */
  public function submitOrder(
    Request $request,
    string $languageCode,
    int $catalogItemId
  ) {
    $referer = $request->header('referer');
    $currencyId = $request->query('currencyId');

    $validator = Validator::make(
      $request->all(),
      [
        'name' => 'string|required',
        'email' => 'email|required',
        'phone' => 'string',
        'note' => 'string',
      ],
      [
        'required' => 'Toto pole je povinné',
        'email' => 'Email je v neplatném formátu',
      ]
    );

    $values = [
      'name' => $request->input('name'),
      'email' => $request->input('email'),
      'phone' => $request->input('phone'),
      'note' => $request->input('note'),
    ];

    if ($validator->fails()) {
      $request
        ->session()
        ->flash('data', [
          'errors' => $validator->messages(),
          'values' => $values,
        ]);

      return redirect($referer);
    } else {
      if (is_numeric($catalogItemId) && is_numeric($currencyId)) {
        $catalogItem = CatalogItems::publicCatalogItem(
          $catalogItemId,
          $languageCode,
          false,
          $this->isAuthorized($request)
        );
        $catalogCurrency = CatalogCurrencies::catalogCurrency(
          (int) $currencyId
        );

        if (isset($catalogItem) && isset($catalogCurrency)) {
          $catalogItem->currency = $catalogCurrency;
          $catalogItem->language = $languageCode;

          if ($catalogItem->booked === 1) {
            $request->session()->flash('order_status', 'already_booked');

            return redirect($referer);
          }

          try {
            $orderId = DB::transaction(function () use (
              $catalogItemId,
              $values,
              $catalogItem,
              $referer
            ) {
              DB::table('catalog_items')
                ->where('id', '=', $catalogItemId)
                ->update(['booked' => 1, 'modified_at' => date('Y-m-d H:i:s')]);

              $orderId = DB::table('orders')->insertGetId([
                'customer' => json_encode($values),
                'catalog_item' => json_encode($catalogItem),
              ]);

              return $orderId;
            });

            // TODO: send mail using https://laravel.com/docs/6.x/mail
            // Email classes are already installed

            $request->session()->flash('order_status', 'success');
            $request->session()->flash('order_id', $orderId);

            return redirect($referer);
          } catch (Throwable $e) {
          }
        }
      }

      $request->session()->flash('order_status', 'error');

      return redirect($referer);
    }
  }
}
