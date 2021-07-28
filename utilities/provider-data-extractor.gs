class ProviderDataExtractor {

  loadProviderInfo(providerInfo) {
    let providers = {};
    let nameIndex = providerInfo.columnIndex('What is the name of the organization?');
    let emailIndex = providerInfo.columnIndex('Email address');
    let urlIndex = providerInfo.columnIndex('Please provide the link to the organization’s website.  ');
    let clientTypeIndex = providerInfo.columnIndex('If you answered YES to the previous question, which specific population(s) does the organization serve? '); 
    let iter = new SheetRowIterator(providerInfo);
    let row;
    while (row = iter.getNextRow()) {
      let name = row[nameIndex];
      let emailVal = row[emailIndex];
      let urlVal = row[urlIndex];
      let client_quals = row[clientTypeIndex];
      providers[name] = { email : emailVal, website : urlVal,
                          services : [], client_qualifications: client_quals };
    }
    return providers;
  }

  loadProviderServices(providerServices, providers) {
    let all_services = {};
    let headers = providerServices.headerData[0];
    let nameIndex = providerServices.columnIndex('What is the name of the organization?');
    let providerIter = new SheetRowIterator(providerServices);
    let services;
    while (services = providerIter.getNextRow()) {
      for (let i = 2; i < headers.length; i++) {
        if (services[i] === 1) {
          let serviceName = headers[i];
          providers[services[nameIndex]].services.push(serviceName);
          all_services[serviceName] = serviceName;
        }
      }
    }
    console.log(Object.keys(all_services));
  }

  extract() {
    const providerWorkbookId = '1BHlfgXgA-Ej3iRwirMAm7kipAGKKSr3gnD95ktyReXM';
    const providerInfoTabName = 'Form responses 1';
    let providerInfo = new SheetClass(providerInfoTabName, providerWorkbookId);
    let providers = this.loadProviderInfo(providerInfo);
    const providerServicesTabName = 'Services provided - categorized';
    let providerServices = new SheetClass(providerServicesTabName, providerWorkbookId);
    this.loadProviderServices(providerServices, providers);

    let keys = Object.keys(providers);
    let template_providers = {};
    for (let i = 0; i < Object.keys(providers).length; i++) {
      template_providers[keys[i]] = { phone_number : '', location : '', gmap_link : '' };
    }
    console.log(JSON.stringify(template_providers));

    let providers2 = {};
    for (let i = 0; i < Object.keys(providers).length / 2; i++) {
      providers2[keys[i]] = providers[keys[i]];
      delete providers[keys[i]];
    }
    console.log(JSON.stringify(providers2));
    console.log(JSON.stringify(providers));
  }
}

function doMatching() {
    (new ProviderDataExtractor()).extract();
}
