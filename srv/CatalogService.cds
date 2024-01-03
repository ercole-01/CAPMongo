using { ercole } from '../db/data-model';

service CatalogService @(path:'/CatalogService'){
    entity customer as projection on ercole.customer ;
    action getCustomerByCountry()
    returns array of {
                        _id: String;
                        count: Integer64;
                     }
}