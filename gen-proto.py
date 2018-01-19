#!/bin/python

import re

filetemp = '''
class ProtoBase
{
	protected static root = null;
	protected proto_data = null;
	protected clazz = null;
	constructor(){
		if (!ProtoBase.root) {
			let content = RES.getRes("protoall_proto");
			// console.log(content);
			ProtoBase.root = dcodeIO.ProtoBuf.loadProto( content );
		}
	}
	encode(): egret.ByteArray {
		return new egret.ByteArray( this.proto_data.toArrayBuffer() );
	}
	decode(bytes: egret.ByteArray){
		this.proto_data = this.clazz.decode(bytes.rawBuffer);
	}
}
Classes
'''

classtemp = '''
class ClassName extends ProtoBase
{
	constructor(){
		super();
		this.clazz = ProtoBase.root.build("ClassName");
		this.proto_data = new this.clazz({});
	}
	toString(){
		return "ClassName"+this.proto_data.encodeJSON();
	}
	Attr
}
'''
attrtemp = '''
	get AttrName() { return this.proto_data.AttrName; }
	set AttrName(val: AttrType) { this.proto_data.AttrName=val; }
'''

def buildpattern(raw):
	return '\s*'.join(raw)

def mapto(data, func):
	return [func(x) for x in data]

def filetype2jstype(ftype):
	if ftype in ['short','int16','int32','int64','long','uint16','uint32','uint64']:
		return 'number'
	else:
		return ftype

def oneAttr(item):
	attr = attrtemp.replace('AttrName', item.group('FieldName'))
	attr = attr.replace('AttrType', filetype2jstype(item.group('DataType')))
	return attr
def parseClass(name, content):
	pattern = buildpattern([
		'(optional|required|repeated)',
		'(?P<DataType>\w+)',
		'(?P<FieldName>\w+)',
		'=',
		'\w+',
		'.*\n',
	])
	result = re.finditer(pattern, content)
	result = mapto(result, oneAttr)
	result = ''.join(result)
	result = classtemp.replace('Attr', result)
	result = result.replace('ClassName', name)
	return result
def gen_proto(fname, out):
	content = open(fname).read()
	pattern = buildpattern([
		'message',
		'(?P<ClassName>\w+)',
		'{',
		'(?P<ClassContent>(.*\\n)+?)',
		'}',
	])
	result = re.finditer(pattern, content)
	result = [parseClass(item.group('ClassName'), item.group('ClassContent')) for item in result]
	result = '\n'.join(result)
	result = filetemp.replace('Classes', result)
	open(out, 'w').write(result)
	print result

def create_protoid(data):
	result = [ '\texport let %s = 0x%04x;'%(name, idx+1) for idx,(name, proto) in enumerate(data)]
	return '\n'.join(result)
def create_protofunc(data):
	result = [ '\t\t\tcase %s: return new %s();'%(name, proto) if proto else '' for idx,(name, proto) in enumerate(data)]
	result = '\n'.join(result);
	return '''
	export function createProto(msgid){
		switch (msgid) {\n%s
			default: return null;
		}
	}'''%(result)
def gen_msgid(out):
	data = [
		['CREATE_PLAYER', 'Player'],
		['U_CREATE_PLAYER_ERROR', 'Result'],
		['U_CREATE_PLAYER', 'Player'],
		['START_MATCH', None],
		['U_START_MATCH', 'Result'],
		['CANCEL_MATCH', None],
		['U_CANCEL_MATCH', 'Result'],
	]
	fout = open(out, 'w');
	fout.write('namespace ProtoType{\n\n')
	fout.write(create_protoid(data));
	fout.write('\n');
	fout.write(create_protofunc(data));
	fout.write('\n}')
	fout.close();
def main():
	gen_proto('resource/config/protoall.proto', 'src/ProtoCenter.ts')
	gen_msgid('src/ProtoType.ts')


main()