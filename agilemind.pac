function FindProxyForURL(url, host) {
    PROXY = "PROXY localhost:8080; DIRECT"

    // only proxy agilemind.com
    if (shExpMatch(host,"*.agilemind.com")) {
        return PROXY;
    }
    // Everything else directly!
    return "DIRECT";
}
