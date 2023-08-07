;/*FB_PKG_DELIM*/

__d("isSecureOculusDotComURI",[],(function(a,b,c,d,e,f){var g=new RegExp("(^|\\.)secure\\.oculus\\.com$","i"),h=new RegExp("(^|\\.)work\\.meta\\.com$","i"),i=["https"];function a(a){if(a.isEmpty()&&a.toString()!=="#")return!1;return!a.getDomain()&&!a.getProtocol()?!1:i.indexOf(a.getProtocol())!==-1&&(g.test(a.getDomain())||h.test(a.getDomain()))}f["default"]=a}),66);