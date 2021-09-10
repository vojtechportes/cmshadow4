<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class Pages extends BaseModel {
  protected function pagesCurrentVersion(string $parent = "") {
    $currentVersions = DB::table('pages')
      ->select('identifier', DB::raw('MAX(version) as currentVersion'))
      ->groupBy('identifier');

    return DB::table('pages')
      ->select([
        'id',
        'pages.identifier',
        'parent',
        'name',
        'template_id',
        'path',
        'created_at',
        'modified_at',
        'created_by',
        'modified_by',
        'status',
        'version',
        'meta_title',
        'meta_description',
        'meta_image',
      ])
      ->joinSub($currentVersions, 'current_versions', function ($join) {
        $join->on('pages.identifier', '=', 'current_versions.identifier');
        $join->on('pages.version', '=', 'current_versions.currentVersion');
      })
      ->where('parent', '=', $parent)
      ->where('pages.status', '!=', 'DELETED');
  }

  protected function allPagesCurrentVersion() {
    $currentVersions = DB::table('pages')
      ->select('identifier', DB::raw('MAX(version) as currentVersion'))
      ->groupBy('identifier');

    return DB::table('pages')
      ->select([
        'id',
        'pages.identifier',
        'parent',
        'name',
        'template_id',
        'path',
        'created_at',
        'modified_at',
        'created_by',
        'modified_by',
        'status',
        'version',
        'meta_title',
        'meta_description',
        'meta_image',
      ])
      ->joinSub($currentVersions, 'current_versions', function ($join) {
        $join->on('pages.identifier', '=', 'current_versions.identifier');
        $join->on('pages.version', '=', 'current_versions.currentVersion');
      })
      ->where('pages.status', '!=', 'DELETED');
  }

  protected function publishedPages(string $parent = "") {
    return DB::table('pages')
      ->select([
        'id',
        'identifier',
        'parent',
        'name',
        'template_id',
        'path',
        'created_at',
        'modified_at',
        'created_by',
        'modified_by',
        'status',
        'version',
        'meta_title',
        'meta_description',
        'meta_image',
      ])
      ->where('parent', '=', $parent)
      ->where('status', '=', 'PUBLISHED');
  }

  protected function allPublishedPages() {
    return DB::table('pages')
      ->select([
        'id',
        'identifier',
        'parent',
        'name',
        'template_id',
        'path',
        'created_at',
        'modified_at',
        'created_by',
        'modified_by',
        'status',
        'version',
        'meta_title',
        'meta_description',
        'meta_image',
      ])
      ->where('status', '=', 'PUBLISHED');
  }

  protected function page(string $identifier) {
    $currentVersion = DB::table('pages')
      ->select('identifier', DB::raw('MAX(version) as currentVersion'))
      ->where('identifier', '=', $identifier)
      ->groupBy('identifier');

    return DB::table('pages')
      ->where('pages.identifier', '=', $identifier)
      ->joinSub($currentVersion, 'current_version', function ($join) {
        $join->on('pages.identifier', '=', 'current_version.identifier');
        $join->on('pages.version', '=', 'current_version.currentVersion');
      })
      ->get()
      ->first();
  }

  protected function pageById(int $id) {
    return DB::table('pages')
      ->where('id', '=', $id)
      ->get()
      ->first();
  }

  protected function pageVersions(string $identifier, string $sortOder) {
    return DB::table('pages')
      ->where('identifier', '=', $identifier)
      ->orderBy('version', $sortOder);
  }

  protected function pageVersion(string $identifier, int $version) {
    return DB::table('pages')
      ->where('identifier', '=', $identifier)
      ->where('version', '=', $version)
      ->get()
      ->first();
  }
}
