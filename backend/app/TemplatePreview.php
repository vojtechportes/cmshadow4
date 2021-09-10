<?php

namespace App;

class TemplatePreview extends BaseModel {
  protected function parseTemplateData(
    string $templatePath,
    string $propertiesPath
  ) {
    $template = file_get_contents($templatePath);
    $properties = file_get_contents($propertiesPath);

    $data = json_decode($properties);
    $data->template = $template;

    return $data;
  }

  protected function getTemplateData(string $viewName, string $templateName) {
    $basePath = CMS_TEMPLATE_PATH . $viewName . '/previews/' . $templateName;
    $defaultBasePath = CMS_TEMPLATE_PATH . '/default/previews/' . $templateName;

    $templatePath = realpath(base_path($basePath . '.html'));
    $propertiesPath = realpath(base_path($basePath . '.json'));

    $defaultTemplatePath = realpath(base_path($defaultBasePath . '.html'));
    $defaultPropertiesPath = realpath(base_path($defaultBasePath . '.json'));

    if (file_exists($templatePath) && file_exists($propertiesPath)) {
      return $this->parseTemplateData($templatePath, $propertiesPath);
    } elseif (
      file_exists($defaultTemplatePath) &&
      file_exists($defaultPropertiesPath)
    ) {
      return $this->parseTemplateData(
        $defaultTemplatePath,
        $defaultPropertiesPath
      );
    } else {
      return false;
    }
  }
}
