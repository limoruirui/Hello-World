var windows = {}
function get_pwd(password, pub_key1) {
	var pub_key = RSA.getPublicKey(pub_key1, "010001")
	return RSA.encrypt(password, pub_key)
}
// get_pwd("123456", "d09ea067642250f278988ed4b40a2e7c899a1a0b5aba9141b85f667cc3a82869c94e8349fb80b5b3d44fe7ff065ed30d5e4184c91574f9bd7039b62ea798960c7c265c0767135956b3bf463e40f220e8cd5ec073ea6d36767d0ed2a5df1b45ba673207fed7a6d21d252d9e9b63c85c19a6654fdd7fa5e75f69382a70917eae0df810c08feae811934d62ad38409a16907fd8aaf8b2c3a1a60062ed8417c7cbe9657834c0be43179b26732f01852a35543c9646b64fe798e93f48809af7ba2815105c1a49c7ca0c2124c6a982e59fc8e0f46913bb363ea816fbde0c758bbe04d2360222564d2d4ae3dd3be11cd798d2205670df75605d6bb7ce26ae34e7db8f6f")
var RSA = {
	getPublicKey: function( $modulus_hex, $exponent_hex ) {
		return new RSAPublicKey( $modulus_hex, $exponent_hex );
	},

	encrypt: function($data, $pubkey) {
		if (!$pubkey) return false;
		$data = this.pkcs1pad2($data,(bnBitLength()+7)>>3);
		if(!$data) return false;
		$data = $data.modPowInt($pubkey.encryptionExponent, $pubkey.modulus);
		if(!$data) return false;
		$data = $data.toString(16);
		if(($data.length & 1) == 1)
			$data = "0" + $data;
		return Base64.encode(Hex.decode($data));
	},

	pkcs1pad2: function($data, $keysize) {
		if($keysize < $data.length + 11)
			return null;
		var $buffer = [];
		var $i = $data.length - 1;
		while($i >= 0 && $keysize > 0)
			$buffer[--$keysize] = $data.charCodeAt($i--);
		$buffer[--$keysize] = 0;
		while($keysize > 2)
			$buffer[--$keysize] = Math.floor(Math.random()*254) + 1;
		$buffer[--$keysize] = 2;
		$buffer[--$keysize] = 0;
		return new BigInteger($buffer);
	}
};
var RSAPublicKey = function($modulus_hex, $encryptionExponent_hex) {
	this.modulus = new BigInteger($modulus_hex, 16);
	this.encryptionExponent = new BigInteger($encryptionExponent_hex, 16);
};
function BigInteger(a,b,c) {
	if(a != null)
		if("number" == typeof a) this.fromNumber(a,b,c);
		else if(b == null && "string" != typeof a) bnpFromString(a,256);
		else bnpFromString(a,b);
}
function bnpFromString(s,b) {
	var k;
	if(b == 16) k = 4;
	else if(b == 8) k = 3;
	else if(b == 256) k = 8; // byte array
	else if(b == 2) k = 1;
	else if(b == 32) k = 5;
	else if(b == 4) k = 2;
	else { this.fromRadix(s,b); return; }
	this.t = 0;
	this.s = 0;
	var i = s.length, mi = false, sh = 0;
	while(--i >= 0) {
		var x = (k==8)?s[i]&0xff:intAt(s,i);
		if(x < 0) {
			if(s.charAt(i) == "-") mi = true;
			continue;
		}
		mi = false;
		if(sh == 0)
			this[this.t++] = x;
		else if(sh+k > this.DB) {
			this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
			this[this.t++] = (x>>(this.DB-sh));
		}
		else
			this[this.t-1] |= x<<sh;
		sh += k;
		if(sh >= this.DB) sh -= this.DB;
	}
	if(k == 8 && (s[0]&0x80) != 0) {
		this.s = -1;
		if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
	}
	bnpClamp();
	if(mi) BigInteger.ZERO.subTo(this,this);
}
function intAt(s,i) {
	var c = BI_RC[s.charCodeAt(i)];
	return (c==null)?-1:c;
}
var BI_RC = new Array();
function bnpClamp() {
	var c = this.s&this.DM;
	while(this.t > 0 && this[this.t-1] == c) --this.t;
}
function bnBitLength() {
	if(this.t <= 0) return 0;
	return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}
