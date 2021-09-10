<?php

namespace App\Mail;
use Exception;
use App\Orders;
use Illuminate\Support\Facades\DB;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderMail extends Mailable {
  use Queueable, SerializesModels;

  protected $emailData;
  protected $data;

  /**
   * Create a new message instance.
   *
   * @return void
   */
  public function __construct(string $type, string $language, int $orderId) {
    $emailData = DB::table('email_templates')
      ->where('type', '=', $type)
      ->where('language', '=', $language)
      ->get()
      ->first();

    $order = Orders::order($orderId);

    $this->emailData = $emailData;

    if (isset($order)) {
      $customer = json_decode($order->customer);
      $catalogItem = json_decode($order->catalog_item);

      $this->data = [
        'CUSTOMER_NAME' => $customer->name,
        'CUSTOMER_PHONE' => $customer->phone,
        'CUSTOMER_EMAIL' => $customer->email,
        'CUSTOMER_NOTE' => $customer->note,
        'CURRENCY_SYMBOL' => $catalogItem->currency->symbol,
        'CURRENCY_CODE' => $catalogItem->currency->code,
        'CURRENCY_NAME' => $catalogItem->currency->name,
        'CATALOG_ITEM' => $catalogItem->data->fields,
        'CREATED_AT' => $catalogItem->created_at,
        'ORDER_ID' => $catalogItem->id,
      ];
    }
  }

  /**
   * Build the message.
   *
   * @return $this
   */
  public function build() {
    if (isset($this->emailData)) {
      try {
        return $this->from('test@domain.com')
          ->view('mail')
          ->with(['html' => $this->emailData->content])
          ->with($this->data);
      } catch (Throwable $error) {
        throw new Exception($error);
      }
    } else {
      throw new Exception('Email template doesn\'t exist');
    }
  }
}
