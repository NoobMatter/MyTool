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

function updateOfferAndRec() {
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
}

window.onload = () => {
  ['model', 'condition', 'storage'].forEach(id =>
    document.getElementById(id).addEventListener('change', updateOfferAndRec)
  );
  loadData();
};