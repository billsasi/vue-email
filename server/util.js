const Imap = require('imap');

function pullMessages(email, password, lastSeqno = null) {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: email,
      password: password,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    });

    function openInbox(cb) {
      imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function () {
      openInbox(function (err, box) {
        if (err) throw err;

        if (lastSeqno == 1) {
          imap.end();
          resolve([]);
          return;
        }

        const leftPtr = Math.max(1, lastSeqno-25);
        const rightPtr = (lastSeqno && lastSeqno-1 > 0) ? lastSeqno-1 : '*';
          
        const fetchStr = lastSeqno ? `${leftPtr}:${rightPtr}` : Math.max(box.messages.total-25, 1) + ':*';
        var f = imap.seq.fetch(fetchStr, {
          bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
        });

        const messagesData = [];

        f.on('message', function (msg, seqno) {
          console.log('Message #%d', seqno);
          var prefix = '(#' + seqno + ') ';
          msg.on('body', function (stream, info) {
            var buffer = '';
            stream.on('data', function (chunk) {
              buffer += chunk.toString('utf8');
            });
            stream.once('end', function () {
              const parsedHeader = Imap.parseHeader(buffer);
              messagesData.push({ ...parsedHeader, seqno });
            });
          });
          msg.once('end', function () {
            console.log(prefix + 'Finished');
          });
        });
        f.once('error', function (err) {
          console.log('Fetch error: ' + err);
        });
        f.once('end', function () {
          console.log('Done fetching all messages!');
          imap.end();
          resolve(messagesData);
        });
      });
    });

    imap.once('error', function (err) {
      console.log(err);
      reject(err);
    });

    imap.once('end', function () {
      console.log('Connection ended');
    });

    imap.connect();
  });
}

module.exports = pullMessages;
