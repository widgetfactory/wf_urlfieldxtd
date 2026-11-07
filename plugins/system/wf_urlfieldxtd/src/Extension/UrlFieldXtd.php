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

use Joomla\CMS\Event\Model\PrepareFormEvent;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\Event\SubscriberInterface;
use Joomla\Registry\Registry;

// phpcs:disable PSR1.Files.SideEffects
\defined('_JEXEC') or die;
// phpcs:enable PSR1.Files.SideEffects

/**
 * UrlFieldXtd plugin
 *
 */
final class UrlFieldXtd extends CMSPlugin implements SubscriberInterface
{
    /**
     * Affects constructor behavior. If true, language files will be loaded automatically.
     *
     * @var    boolean
     */
    protected $autoloadLanguage = true;

    /**
     * Returns an array of events this subscriber will listen to.
     *
     * @return  array
     */
    public static function getSubscribedEvents(): array
    {
        return [
            'onContentPrepareForm' => 'onContentPrepareForm',
        ];
    }

    /**
     * Add the extra parameters to the URL field type form.
     *
     * @param   PrepareFormEvent  $event  The event object
     *
     * @return  void
     */
    public function onContentPrepareForm(PrepareFormEvent $event): void
    {
        $app = $this->getApplication();

        if (!$app->isClient('administrator')) {
            return;
        }

        // must be an html doctype
        if ($app->getDocument()->getType() !== 'html') {
            return;
        }

        $form = $event->getForm();

        if (strpos($form->getName(), 'com_fields.field') !== 0) {
            return;
        }

        $data = new Registry($event->getData());

        if ($data->get('type', '') !== 'url') {
            return;
        }

        $fields = JPATH_PLUGINS . '/system/wf_urlfieldxtd/forms/fields.xml';

        if (!is_file($fields)) {
            return;
        }

        $xml = simplexml_load_file($fields);

        if ($xml) {
            $form->setField($xml);
        }
    }
}
