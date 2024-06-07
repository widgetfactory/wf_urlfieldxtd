<?php
/**
 * @package     Joomla.Plugin
 * @subpackage  System.WfUrlFieldXtd
 *
 * @copyright   Copyright (C) 2005 - 2023 Open Source Matters, Inc. All rights reserved.
 * @copyright   Copyright (c) 2009-2024 Ryan Demmer. All rights reserved
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Plugin\System\WfUrlFieldXtd\Extension;

use Joomla\CMS\Factory;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\Registry\Registry;
use Joomla\CMS\Form\Form;

// phpcs:disable PSR1.Files.SideEffects
\defined('_JEXEC') or die;
// phpcs:enable PSR1.Files.SideEffects

/**
 * UrlFieldXtd plugin
 *
 */
final class UrlFieldXtd extends CMSPlugin
{
    /**
     * Affects constructor behavior. If true, language files will be loaded automatically.
     *
     * @var    boolean
     */
    protected $autoloadLanguage = true;
    
    public function onContentPrepareForm(Form $form, $data = [])
    {
        $app = $this->getApplication();

        if (!$app->isClient('administrator')) {
            return true;
        }

        $docType = $app->getDocument()->getType();

        // must be an html doctype
        if ($docType !== 'html') {
            return true;
        }

        // Update MediaField parameters
        if (strpos($form->getName(), 'com_fields.field') === 0) {            

            if (is_array($data) && isset($data['type']) && $data['type'] == 'url') {
                $fields = JPATH_PLUGINS . '/system/wf_urlfieldxtd/forms/fields.xml';

                if (is_file($fields)) {
                    if ($fields_xml = simplexml_load_file($fields)) {
                        $form->setField($fields_xml);
                    }
                }
            }
        }
    }
}
