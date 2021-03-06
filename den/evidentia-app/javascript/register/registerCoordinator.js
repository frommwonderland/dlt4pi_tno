/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'evidentia-network', 'connection-profiles','connection-coord.json');

async function main() {
    var args = process.argv.slice(2);
    if(args.length < 1) {
        console.log('Wrong number of arguments - Identity username is missing')
        process.exit(1);
    }
    if(args.length > 1) {
        console.log('Wrong number of arguments - Requires 1 argument')
        process.exit(1);
    }

    var username = args[0]
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '../wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(username);
        if (userExists) {
            console.log(`An identity for the user "${username}" already exists in the wallet`);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin_coord');
        if (!adminExists) {
            console.log('An identity for the admin user "admin_coord" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'admin_coord', discovery: { enabled: true, asLocalhost: true } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        var attributes = [{name:'serviceProviderType', value: 'coordinator', ecert: true}];
        const secret = await ca.register({ affiliation: 'org3.department1', enrollmentID: username, role: 'client', attrs: attributes }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret, attr_reqs: [{ name: "serviceProviderType", optional: false }]});
        const userIdentity = X509WalletMixin.createIdentity('CoordinatorMSP', enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(username, userIdentity);
        console.log(`Successfully registered and enrolled admin user "${username}" and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to register user "${username}": ${error}`);
        process.exit(1);
    }
}

main();
