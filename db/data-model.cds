using { cuid, managed, temporal, Currency } from '@Sap/cds/common';
namespace ercole;
entity customer: managed {
    key id: String;
    name: String(256);
    type: String(2);
    emailId: String(105);
    contactNo: String(32);
    address: String(256);
    companyName: String(128);
    country: String(128);
}
