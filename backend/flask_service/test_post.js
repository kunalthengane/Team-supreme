// Simple test script to POST a complaint to the Flask service and print the response.
(async () => {
  try {
    const res = await fetch('http://localhost:5000/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test from script',
        description: 'The cafeteria food is awful and unsafe.',
        category: 'facilities',
        severity: 'medium',
        submitted_by: 'script'
      }),
    });

    const data = await res.text();
    console.log('Status:', res.status);
    console.log('Body:', data);
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
