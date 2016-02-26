var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * N Model
 * ==========
 */

var N = new keystone.List('N');

N.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

// Provide access to Keystone
N.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Registration
 */

N.defaultColumns = 'name, email, isAdmin';
N.register();
