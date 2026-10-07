# Project Prompts Log

This document records all user prompts submitted during the development of the **URA Property Market Information & Singapore Spatial Intelligence Portal**.

---

### Prompt 1: Initial Application Build
```text
Build me an app with screens that look like this. You can hotlink images from the html https://eservice.ura.gov.sg/property-market-information/pmiResidentialTransaction and ensure the interface is responsive and mobile-friendly.
```

---

### Prompt 2: GitHub Repository Setup & Push
```text
git push https://<GITHUB_TOKEN>@github.com/josephineleehuiyee-ai/mcp-starter.git
```

---

### Prompt 3: URA DataService API Integration
```text
# 1. Each day, trade the AccessKey for today's Token:
#    (header: AccessKey: )
https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1

# 2. Data calls send BOTH headers (AccessKey + Token):
# Private residential transactions (4 batches by postal district - fetch all, merge):
https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=1

# Live carpark lots + rates:
https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=Car_Park_Availability
https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=Car_Park_Details
```

---

### Prompt 4: Code Sync Push
```text
git push
```

---

### Prompt 5: Modular API Folder & Health Monitor
```text
1) create a /api folder under the project main to store all the apis
2) create a /api/health.js to monitor if the apis are working
```

---

### Prompt 6: Interactive Singapore Heatmap
```text
include the Singapore map to provide heatmap where are the highest transacted area
```

---

### Prompt 7: SLA OneMap API Integration (Token, Geocoding, Reverse Geocoding & Multimodal Routing)
```text
# Mint a token (POST, JSON body {"email":"...","password":"..."}; lasts 3 days):
https://www.onemap.gov.sg/api/auth/post/getToken

# Geocode / search (Authorization header now officially required):
https://www.onemap.gov.sg/api/common/elastic/search?searchVal=raffles%20place&returnGeom=Y&getAddrDetails=Y&pageNum=1

# Reverse geocode (token required):
https://www.onemap.gov.sg/api/public/revgeocode?location=1.3,103.8&buffer=40&addressType=All

# Routing: walk | drive | cycle | pt (token required):
https://www.onemap.gov.sg/api/public/routingsvc/route?start=1.320981,103.844150&end=1.326762,103.8559&routeType=walk
```

---

### Prompt 8: Prompts Documentation
```text
create a prompt.md containing all my prompts
```
