fetch('https://sarpras-ppkasn.vercel.app/room').then(r=>r.text()).then(t => { const match = t.match(/<table(.*?)<\/table>/si); console.log(match ? match[0].substring(0, 1000) : 'No table'); });
