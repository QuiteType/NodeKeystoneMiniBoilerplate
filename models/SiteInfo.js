var keystone = require('keystone'),
	mongoose = require('mongoose'),
	Types = keystone.Field.Types;

/**
 * SiteInfo
 * ==========
 */


var SiteInfo = new keystone.List('SiteInfo', {
	map: { name: 'title' },
	track: true,
	sortable: true
});

SiteInfo.add({
	title: { type: String, initial: true, required: true},
	sitelabel: { type: String, wysiwyg: true},
	siteDescription: { type: String, wysiwyg: true},
	googleSiteVerification: { type: String, wysiwyg: true},
	siteTags: { type: String, wysiwyg: true},
	siteContact: { type: String, wysiwyg: true},
	twitterContact: { type: String, wysiwyg: true}
});

SiteInfo.defaultColumns = 'title';
SiteInfo.register();
