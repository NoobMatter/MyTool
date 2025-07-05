let SwappaData = {};

async function loadData() {
  try {
    const response = await fetch('swappaData.json');
    SwappaData = await response.json();
    updateOfferAndRec();
  } catch (error) {
    console.error('Failed to load swappaData.json:', error);
  }
}

async function fetchEbayAverage(ebayUrl) {
  try {
    const response = await fetch('/api/ebay-average', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: ebayUrl })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.average_price;
  } catch (error) {
    console.error('Failed to fetch eBay average:', error);
    return null;
  }
}

async function updateOfferAndRec() {
  const model = document.getElementById('model').value;
  const condition = document.getElementById('condition').value;
  const storage = document.getElementById('storage').value;

  const offer = SwappaData?.[model]?.[condition]?.[storage];

  const offerText = offer !== undefined
    ? `&#x1F4B8; Swappa Offer: $${offer}`
    : '&#x1F4B8; Swappa Offer: N/A';

  document.getElementById('SwappaOffer').innerHTML = offerText;

  if (offer !== undefined) {
    const recEbay = Math.round((offer + 80) / 0.864);
    document.getElementById('RecEbay').innerHTML = `&#x1F4E6; Recommended eBay List Price: $${recEbay}`;
  } else {
    document.getElementById('RecEbay').innerHTML = `&#x1F4E6; Recommended eBay List Price: N/A`;
  }

  const ebayUrl = updateEbayLink(model, storage);
  
  // Fetch eBay average price
  if (ebayUrl) {
    const ebayAverageElement = document.getElementById('EbayAverage');
    ebayAverageElement.innerHTML = `&#x1F4CA; Average eBay Sold Price:`;
    ebayAverageElement.classList.add('loading');
    
    const averagePrice = await fetchEbayAverage(ebayUrl);
    
    ebayAverageElement.classList.remove('loading');
    
    if (averagePrice !== null) {
      ebayAverageElement.innerHTML = `&#x1F4CA; Average eBay Sold Price: $${averagePrice}`;
    } else {
      ebayAverageElement.innerHTML = `&#x1F4CA; Average eBay Sold Price: N/A`;
    }
  } else {
    document.getElementById('EbayAverage').innerHTML = `&#x1F4CA; Average eBay Sold Price: N/A`;
  }
}

function updateEbayLink(model, storage) {
  let ebayLink = "";

  if (model === "iphone12") {
    if (storage === "64") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252012&Storage%2520Capacity=64%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "128") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252012&Storage%2520Capacity=128%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "256") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252012&Storage%2520Capacity=256%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }

  } else if (model === "iphone12pro") {
    if (storage === "128") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252012%2520Pro&Storage%2520Capacity=128%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "256") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252012%2520Pro&Storage%2520Capacity=256%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "512") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252012%2520Pro&Storage%2520Capacity=512%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }

  } else if (model === "iphone12promax") {
    if (storage === "128") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252012%2520Pro%2520Max&Storage%2520Capacity=128%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "256") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252012%2520Pro%2520Max&Storage%2520Capacity=256%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "512") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252012%2520Pro%2520Max&Storage%2520Capacity=512%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }

  } else if (model === "iphone13pro") {
    if (storage === "128") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252013%2520Pro&Storage%2520Capacity=128%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "256") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252013%2520Pro&Storage%2520Capacity=256%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "512") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252013%2520Pro&Storage%2520Capacity=512%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }else if (storage === "1") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252013%2520Pro&Storage%2520Capacity=1%2520TB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }
  

  } else if (model === "iphone13promax") {
    if (storage === "128") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252013%2520Pro%2520Max&Storage%2520Capacity=128%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "256") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252013%2520Pro%2520Max&Storage%2520Capacity=256%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "512") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252013%2520Pro%2520Max&Storage%2520Capacity=512%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }else if (storage === "1") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252013%2520Pro%2520Max&Storage%2520Capacity=1%2520TB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }

  } else if (model === "iphone14pro") {
    if (storage === "128") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252014%2520Pro&Storage%2520Capacity=128%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "256") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252014%2520Pro&Storage%2520Capacity=256%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "512") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252014%2520Pro&Storage%2520Capacity=512%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }else if (storage === "1") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252014%2520Pro&Storage%2520Capacity=1%2520TB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }

  } else if (model === "iphone14promax") {
    if (storage === "128") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252014%2520Pro%2520Max&Storage%2520Capacity=128%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "256") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252014%2520Pro%2520Max&Storage%2520Capacity=256%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "512") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252014%2520Pro%2520Max&Storage%2520Capacity=512%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }else if (storage === "1") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252014%2520Pro%2520Max&Storage%2520Capacity=1%2520TB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }

  } else if (model === "iphone15pro") {
    if (storage === "128") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252015%2520Pro&Storage%2520Capacity=128%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "256") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252015%2520Pro&Storage%2520Capacity=256%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "512") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252015%2520Pro&Storage%2520Capacity=512%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }else if (storage === "1") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252015%2520Pro&Storage%2520Capacity=1%2520TB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }

  } else if (model === "iphone15promax") {
    if (storage === "256") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252015%2520Pro%2520Max&Storage%2520Capacity=256%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "512") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252015%2520Pro%2520Max&Storage%2520Capacity=512%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }else if (storage === "1") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&_oaa=1&Model=Apple%2520iPhone%252015%2520Pro%2520Max&Storage%2520Capacity=1%2520TB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }

  } else if (model === "iphone13") {
    if (storage === "128") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&Model=Apple%2520iPhone%252013&Storage%2520Capacity=128%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "256") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&Model=Apple%2520iPhone%252013&Storage%2520Capacity=256%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "512") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&Model=Apple%2520iPhone%252013&Storage%2520Capacity=512%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }

  } else if (model === "iphone14") {
    if (storage === "128") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&Model=Apple%2520iPhone%252014&Storage%2520Capacity=128%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "256") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&Model=Apple%2520iPhone%252014&Storage%2520Capacity=256%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "512") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&Model=Apple%2520iPhone%252014&Storage%2520Capacity=512%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }

  } else if (model === "iphone15") {
    if (storage === "128") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&Model=Apple%2520iPhone%252015&Storage%2520Capacity=128%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "256") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&Model=Apple%2520iPhone%252015&Storage%2520Capacity=256%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    } else if (storage === "512") {
      ebayLink = "https://www.ebay.com/sch/i.html?_nkw=Iphone&LH_Complete=1&LH_Sold=1&Model=Apple%2520iPhone%252015&Storage%2520Capacity=512%2520GB&Network=Unlocked&_dcat=9355&LH_ItemCondition=1500%7C2010%7C2030%7C2020%7C3000";
    }
  }
  
  const linkBtn = document.getElementById('EbayLink');
  if (ebayLink !== "") {
    linkBtn.href = ebayLink;
    linkBtn.style.display = 'inline-block';
  } else {
    linkBtn.removeAttribute("href");
    linkBtn.style.display = 'none';
  }
  
  return ebayLink;
}

window.onload = () => {
  ['model', 'condition', 'storage'].forEach(id =>
    document.getElementById(id).addEventListener('change', updateOfferAndRec)
  );
  loadData();
};