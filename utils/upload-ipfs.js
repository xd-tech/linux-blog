const NetlifyAPI = require('netlify')

const updateNetlifyDNS = async function () {
    const hash = process.argv[2]
    const zone_id = process.argv[3]
    const netlify_key = process.argv[4]
    const record_value = `dnslink=/ipfs/${hash}`
    console.log("uploading hash", hash);

    const client = new NetlifyAPI(netlify_key)
    let response = await client.getDnsRecords({
        zone_id
    })
    console.log(response)
    const list = response.filter((item) => item["hostname"] == "_dnslink.students-tech.blog")
    for (let i = 0; i < list.length; i++) {
        await client.deleteDnsRecord({
            zone_id,
            dns_record_id: list[i]["id"]
        })
    }
    response = await client.createDnsRecord({
        zone_id,
        body: {
            type: "TXT",
            hostname: "_dnslink.students-tech.blog",
            value: record_value,
            ttl: 60
        }
    })
    console.log(response)
    response = await client.getDnsRecords({
        zone_id
    })
    console.log(response)
}

updateNetlifyDNS()