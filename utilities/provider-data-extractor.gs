class ProviderDataExtractor {

  loadProviderInfo(providerInfo) {
    let providers = {};
    let nameIndex = providerInfo.columnIndex('What is the name of the organization?');
    let emailIndex = providerInfo.columnIndex('Email address');
    let urlIndex = providerInfo.columnIndex('Please provide the link to the organization’s website.  ');
    let iter = new SheetRowIterator(providerInfo);
    let row;
    while (row = iter.getNextRow()) {
      let name = row[nameIndex];
      let emailVal = row[emailIndex];
      let urlVal = row[urlIndex];
      providers[name] = { email : emailVal, url : urlVal, services : [] };
    }
    return providers;
  }

  loadProviderServices(providerServices, providers) {
    let headers = providerServices.headerData[0];
    let nameIndex = providerServices.columnIndex('What is the name of the organization?');
    let providerIter = new SheetRowIterator(providerServices);
    let services;
    while (services = providerIter.getNextRow()) {
      for (let i = 2; i < headers.length; i++) {
        if (services[i] === 1) {
          let serviceName = headers[i];
          providers[services[nameIndex]].services.push(serviceName);
        }
      }
    }
  }

  extract() {
    const providerWorkbookId = '1BHlfgXgA-Ej3iRwirMAm7kipAGKKSr3gnD95ktyReXM';
    const providerInfoTabName = 'Form responses 1';
    let providerInfo = new SheetClass(providerInfoTabName, providerWorkbookId);
    let providers = this.loadProviderInfo(providerInfo);
    const providerServicesTabName = 'Services provided - categorized';
    let providerServices = new SheetClass(providerServicesTabName, providerWorkbookId);
    this.loadProviderServices(providerServices, providers);
    console.log(JSON.stringify(providers));
  }
}

function doMatching() {
    (new ProviderDataExtractor()).extract();
}
