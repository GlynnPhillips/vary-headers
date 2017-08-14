/**
 * Note: much of this code is from https://github.com/carsales/aws-request-signer/blob/c835ca69e74a5b5e7d6eee7aaab8bbd7fbcdff4d/src/signer.js
 * licensed under https://github.com/carsales/aws-request-signer/blob/c835ca69e74a5b5e7d6eee7aaab8bbd7fbcdff4d/LICENSE
 * with many thanks to John Jones :+1:
 */

var algorithm = 'AWS4-HMAC-SHA256';
var hashedPayloads = new Array();

var region = '';
var accesskeyid = '';
var secretaccesskey = '';

function setSettings(settings) {
	if (settings.usEast1) {
		region = 'us-east-1';
	} else if (settings.euWest1) {
		region = 'eu-west-1';
	}
	accesskeyid = settings.accessKeyId;
	secretaccesskey = settings.secretAccessKey;
}

module.exports.beforeRequest = function(details, settings) {
	if (!valid(settings))
		return;

	var hashedPayload = getHashedPayload(details);
	hashedPayloads[details.requestId] = hashedPayload;
	log('Hashed Payload: ' + hashedPayload);
	
	return;
}

module.exports.beforeSendHeaders = function(details, settings) {
	if (!valid(settings))
		return;

	setSettings(settings);
	var authedHeaders = signRequest(details);
	delete hashedPayloads[details.requestId];

	return authedHeaders;
}

function valid(settings) {
  if (!settings.usEast1 && !settings.euWest1)
	  return false;
  if (!settings.accessKeyId || settings.accessKeyId.length === 0)
	  return false;
  if (!settings.secretAccessKey || settings.secretAccessKey.length === 0)
	  return false;
  return true;
}

function signRequest(request) {
  log('Region: ' + region);
  log('Access Key Id: ' + accesskeyid);
  log('Secret Access Key: ' + secretaccesskey);

  var amzDateTime = getAmzDateTime();
  log('AmzDateTime: ' + amzDateTime);

  var amzDate = amzDateTime.substr(0,8);
  var headers = request.requestHeaders;
  headers.push({name:'X-Amz-Algorithm', value:algorithm});
  headers.push({name:'X-Amz-Date', value:amzDateTime});

  var url = request.url;
  var host = getHost(url);
  log('Host: ' + host);
  
  headers.push({name:'Host', value:host});
  
  var canonicalRequest = getCanonicalRequest(request);
  log('Canonical Request: ' + canonicalRequest);
  
  var canonicalRequestHash = CryptoJS.SHA256(canonicalRequest); 
  log('Canonical Request Hash: ' + canonicalRequestHash);
  
	var service = 'es';
  var stringToSign = algorithm + '\n';
  stringToSign += amzDateTime + '\n';
  stringToSign += amzDate + '/' + region + '/' + service + '/' + 'aws4_request' + '\n';
  stringToSign += canonicalRequestHash;
  log('String To Sign: ' + stringToSign);
  
  var kDate = CryptoJS.HmacSHA256(amzDate, 'AWS4' + secretaccesskey);
  var kRegion = CryptoJS.HmacSHA256(region, kDate);
  var kService = CryptoJS.HmacSHA256(service, kRegion);
  var kKey = CryptoJS.HmacSHA256('aws4_request', kService);
  var signature = CryptoJS.HmacSHA256(stringToSign, kKey);
  log('Signature: ' + signature);
  
  var authorization = algorithm + ' ';
  authorization += 'Credential=' + accesskeyid + '/' + amzDate + '/' + region + '/' + service + '/' + 'aws4_request, ';
  authorization += 'SignedHeaders=' + getSignedHeaders(headers) + ', ';
  authorization += 'Signature=' + signature;
  log('Authorization: ' + authorization);

  headers.push({name:'Authorization', value:authorization});
  
  return headers;
}

function getHost(url) {
  var parser = document.createElement('a');
  parser.href = url;
  var host = parser.hostname.toLowerCase();
  return host;
}
function getAmzDateTime() {
  var date = new Date();
  var amzDateTime = date.toISOString().replace(/[:\-]|\.\d{3}/g, '');
  return amzDateTime;
}
function getCanonicalRequest(request) {
  var url = request.url;
  var host = getHost(url);
  var method = request.method;
  var headers = request.requestHeaders;

  log('Url: ' + url);
  log('Host: ' + host);
  log('Method: ' + method);

  var canonicalUri = getCanonicalUri(url);
  var canonicalQuerystring = getCanonicalQueryString(url);
  var canonicalHeaders = getCanonicalHeaders(headers);
  var signedHeaders = getSignedHeaders(headers);
  
  log('Canonical URI: ' + canonicalUri);
  log('Canonical Querystring: ' + canonicalQuerystring);
  log('Canonical Headers: ' + canonicalHeaders);
  log('Signed Headers: ' + signedHeaders);
  
  var canonicalRequest = method + '\n';
  canonicalRequest += canonicalUri + '\n';
  canonicalRequest += canonicalQuerystring + '\n';
  canonicalRequest += canonicalHeaders + '\n';
  canonicalRequest += signedHeaders + '\n';
  canonicalRequest += hashedPayloads[request.requestId];
  
  return canonicalRequest;
}
function getCanonicalUri(url) {
  var parser = document.createElement('a');
  parser.href = url;
  var uri = parser.pathname;
  if (uri.length === 0)
	  uri = '/';
  else if (uri.substr(0,1) !== '/')
	  uri = '/' + uri;

  return uriEncode(uri);
}
function getCanonicalQueryString(url) {
  var parser = document.createElement('a');
  parser.href = url;
  var querystring = parser.search;
  var params = querystring.split('&');
  for (var i=0; i<params.length; i++) {
	  if (params[i].substr(0,1) === '?')
        params[i] = params[i].substr(1, params[i].length-1);
      params[i] = params[i].split('=').map(decodeURIComponent).map(uriEncodeSlash).join('=');
  }

  var sortedParams = params.sort();
  var canonicalQuerystring = sortedParams.join('&');
  return canonicalQuerystring;
}
function getCanonicalHeaders(headers) {
  var aggregatedHeaders = new Array();
  for (var i=0; i<headers.length; i++) {
	var name = headers[i].name.toLowerCase();
	
	if (name.indexOf('x-devtools-') > -1)
		continue;
	
	var headerfound = false;
	for (var x=0; x<aggregatedHeaders.length; x++) {
	  if (aggregatedHeaders[x].substr(0,name.length) === name) {
	    aggregatedHeaders[x] += headers[i].value.trim();
		headerfound=true;
	    break;
	  }
	}
	
	if (!headerfound)
		aggregatedHeaders.push(name + ':' + headers[i].value);
  }
  aggregatedHeaders.sort(function(a,b) { 
        var name1 = a.substr(0,a.indexOf(':'));
        var name2 = b.substr(0,b.indexOf(':'));
        var order = (name1 < name2) ? -1 : (name1 > name2) ? 1 : 0;
        return order;
  });
  var canonicalHeaders = aggregatedHeaders.join('\n');
  return canonicalHeaders + '\n';
}
function getSignedHeaders(headers) {
  var signedHeaders = new Array();
  for (var i=0; i<headers.length; i++) {
	var name = headers[i].name.toLowerCase();
	if (name.indexOf('x-devtools-') > -1)
		continue;
	signedHeaders.push(name);
  }
  var sortedHeaders = signedHeaders.sort();
  return sortedHeaders.join(';');
}
function getHashedPayload(request) {
  var body = request.requestBody;
  if (body && body.raw && body.raw.length > 0 && body.raw[0].bytes) {
	var str = String.fromCharCode.apply(String, new Uint8Array(body.raw[0].bytes));
	log('Raw Payload: ' + str);
	return CryptoJS.SHA256(str);
  }

  return CryptoJS.SHA256('');
}
function log(msg) {
  console.log( msg);
}
function uriEncodeSlash(input) {
	return uriEncode(input, true)
}
function uriEncode(input, slash) {
  var ch;
  var i;
  var output = '';
  for (i = 0; i < input.length; i++) {
    ch = input[i];
    if ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') || ch === '_' || ch === '-' || ch === '~' || ch === '.' || (!slash && ch === '/')) {
      output += ch;
    } else {
      output += `%${ch.charCodeAt(0).toString(16).toUpperCase()}`;
    }
  }
  return output;
};
