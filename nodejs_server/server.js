/** ++*[https_sample.js]*++ - node.js�ŃI���I��https�T�[�o�̃T���v���v���O����
 *
 * @version 0.0.1
 * @author TOmoyuki Inoue
 */
 
var https = require('https');
var fs = require('fs');
 
// �ؖ����̃t�@�C�����w�肵�܂�
var options = { 
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};
 
// �|�[�g3000�ŃT�[�o�𐶐����܂�
https.createServer(options, function(req, res) {
fs.readFile('./readfile.html', 'utf-8', function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('not found!');
            return res.end();
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
})
}).listen(3000);;