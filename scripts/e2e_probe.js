(async function(){
  const ports = [3000,3001,3002,3003,3004,3005];
  const hosts = ['localhost', '127.0.0.1', '[::1]', '10.44.199.118'];
  let base = null;
  for (const h of hosts) {
    for (const p of ports) {
      try {
        const res = await fetch(`http://${h}:${p}/api/health`);
        if (res.ok) {
          const j = await res.json();
          console.log('FOUND:' + h + ':' + p, JSON.stringify(j));
          base = `http://${h}:${p}/api`;
          break;
        }
      } catch (e) {
        // ignore
      }
    }
    if (base) break;
  }
  if (!base) {
    console.error('No backend responsive on ports', ports);
    process.exit(1);
  }

  try {
    const create = await fetch(base + '/complaints', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: 'E2E Probe',
        description: 'Probe created complaint',
        category: 'facilities',
        severity: 'low',
        submittedBy: 'Automated',
      }),
    });
    const createJson = await create.json();
    console.log('CREATE_RESPONSE:' + JSON.stringify(createJson));
    const id = createJson?.data?._id;
    if (!id) {
      console.error('No id returned');
      process.exit(1);
    }

    const support = await fetch(base + `/complaints/${id}/support`, { method: 'POST' });
    const supportJson = await support.json();
    console.log('SUPPORT_RESPONSE:' + JSON.stringify(supportJson));

    const get = await fetch(base + `/complaints/${id}`);
    const getJson = await get.json();
    console.log('GET_RESPONSE:' + JSON.stringify(getJson));

    process.exit(0);
  } catch (e) {
    console.error('ERROR', e);
    process.exit(1);
  }
})();
