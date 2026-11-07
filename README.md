# URL Field Xtd
Adds extra settings to the Joomla URL custom field.

## Download
Click [here to download](https://github.com/widgetfactory/wf_urlfieldxtd/releases) the latest release.

## Requirements
Joomla 5.x or 6.x

Version 1.0.3 and later need Joomla 5 or newer. If you are still on Joomla 4.4, use [version 1.0.2](https://github.com/widgetfactory/wf_urlfieldxtd/releases/tag/1.0.2).

## Installation
Install it with the Joomla Extensions Installer. See [Installing an extension](https://docs.joomla.org/Installing_an_extension).

## What it does
This plugin adds three settings to the URL custom field:

- **Text**: the text to show for the link
- **Target**: where the link opens, for example in a new window
- **Class**: one or more CSS classes to add to the link

## How to use it
1. Go to **System > Manage > Plugins** and enable **URL Field parameter options**.
2. Create or edit a URL custom field. The Text, Target and Class settings appear in the field's options.

Joomla's own URL field layout does not use these settings. To apply them to the link, add a layout override to your template at `templates/YOUR_TEMPLATE/html/plg_fields_url/url.php`. For example:

```php
<?php

defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;

$value = $field->value;

if ($value == '') {
    return;
}

$internal = Uri::isInternal($value);
$text     = $fieldParams->get('text', '') ?: Text::_($internal ? 'JVISIT_LINK' : 'JVISIT_WEBSITE');
$target   = $fieldParams->get('target', '') ?: ($internal ? '' : '_blank');
$class    = $fieldParams->get('class', '');

$attributes = '';

if ($target) {
    $attributes .= ' target="' . htmlspecialchars($target) . '"';
}

if (!$internal) {
    $attributes .= ' rel="nofollow noopener noreferrer"';
}

if ($class) {
    $attributes .= ' class="' . htmlspecialchars($class) . '"';
}

echo sprintf('<a href="%s"%s>%s</a>', htmlspecialchars($value), $attributes, htmlspecialchars($text));
```

## Bug Reports / Support / Issues
Please use the [GitHub issue tracker](https://github.com/widgetfactory/wf_urlfieldxtd/issues) to report any problems.
