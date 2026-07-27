async function testStorefrontHtml() {
  try {
    const res = await fetch('https://speisely.de/catering/partyservice-kuepper');
    const html = await res.text();
    console.log('HTML Length:', html.length);
    console.log('Contains Partyservice Kuepper:', html.includes('Partyservice Kuepper') || html.includes('Partyservice Küpper'));
    console.log('Contains Catering:', html.includes('Catering'));
  } catch (e) {
    console.error(e);
  }
}
testStorefrontHtml();
