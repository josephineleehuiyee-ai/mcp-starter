/**
 * API Health Monitor (URA DataService & OneMap Singapore SLA)
 * Route: GET /api/health
 */

export async function checkApiHealth() {
  const startTime = Date.now();
  const uraAccessKey = process.env.URA_ACCESS_KEY;
  const isUraConfigured = Boolean(uraAccessKey && uraAccessKey !== 'MY_URA_ACCESS_KEY');

  const onemapEmail = process.env.ONEMAP_EMAIL;
  const onemapPassword = process.env.ONEMAP_PASSWORD;
  const isOnemapConfigured = Boolean(onemapEmail && onemapPassword && onemapEmail !== 'MY_ONEMAP_EMAIL');

  const checks = {
    uraTokenService: {
      endpoint: 'https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1',
      status: 'untested',
      latencyMs: null,
      message: null,
    },
    uraResidentialTransactions: {
      endpoint: 'https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=1',
      status: 'untested',
      latencyMs: null,
      message: null,
    },
    uraCarparkAvailability: {
      endpoint: 'https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=Car_Park_Availability',
      status: 'untested',
      latencyMs: null,
      message: null,
    },
    uraCarparkDetails: {
      endpoint: 'https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=Car_Park_Details',
      status: 'untested',
      latencyMs: null,
      message: null,
    },
    onemapTokenService: {
      endpoint: 'https://www.onemap.gov.sg/api/auth/post/getToken',
      status: 'untested',
      latencyMs: null,
      message: null,
    },
    onemapGeocodeSearch: {
      endpoint: 'https://www.onemap.gov.sg/api/common/elastic/search?searchVal=raffles%20place&returnGeom=Y&getAddrDetails=Y&pageNum=1',
      status: 'untested',
      latencyMs: null,
      message: null,
    },
    onemapReverseGeocode: {
      endpoint: 'https://www.onemap.gov.sg/api/public/revgeocode?location=1.3,103.8&buffer=40&addressType=All',
      status: 'untested',
      latencyMs: null,
      message: null,
    },
    onemapRouting: {
      endpoint: 'https://www.onemap.gov.sg/api/public/routingsvc/route?start=1.320981,103.844150&end=1.326762,103.8559&routeType=walk',
      status: 'untested',
      latencyMs: null,
      message: null,
    },
  };

  let uraToken = null;

  // 1. Probe URA Token
  if (isUraConfigured && uraAccessKey) {
    const tStart = Date.now();
    try {
      const res = await fetch(checks.uraTokenService.endpoint, {
        headers: { 'AccessKey': uraAccessKey, 'User-Agent': 'Mozilla/5.0 URA-Health/1.0' },
        signal: AbortSignal.timeout(6000),
      });
      checks.uraTokenService.latencyMs = Date.now() - tStart;
      if (res.ok) {
        const json = await res.json();
        if (json.Status === 'Success') {
          checks.uraTokenService.status = 'healthy';
          checks.uraTokenService.message = 'Daily token generated successfully';
          uraToken = json.Result;
        } else {
          checks.uraTokenService.status = 'degraded';
          checks.uraTokenService.message = json.Message || `Status: ${json.Status}`;
        }
      } else {
        checks.uraTokenService.status = 'unhealthy';
        checks.uraTokenService.message = `HTTP ${res.status}`;
      }
    } catch (err) {
      checks.uraTokenService.status = 'unreachable';
      checks.uraTokenService.latencyMs = Date.now() - tStart;
      checks.uraTokenService.message = err.message || 'Timeout';
    }
  } else {
    checks.uraTokenService.status = 'configuration_missing';
    checks.uraTokenService.message = 'URA_ACCESS_KEY not configured';
  }

  // 2. Probe OneMap Token
  let onemapToken = null;
  if (isOnemapConfigured) {
    const omStart = Date.now();
    try {
      const res = await fetch(checks.onemapTokenService.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 OneMap-Health/1.0' },
        body: JSON.stringify({ email: onemapEmail, password: onemapPassword }),
        signal: AbortSignal.timeout(6000),
      });
      checks.onemapTokenService.latencyMs = Date.now() - omStart;
      if (res.ok) {
        const json = await res.json();
        if (json.access_token) {
          checks.onemapTokenService.status = 'healthy';
          checks.onemapTokenService.message = 'OneMap token minted successfully (valid 3 days)';
          onemapToken = json.access_token;
        } else {
          checks.onemapTokenService.status = 'degraded';
          checks.onemapTokenService.message = json.error || 'Token missing';
        }
      } else {
        checks.onemapTokenService.status = 'unhealthy';
        checks.onemapTokenService.message = `HTTP ${res.status}`;
      }
    } catch (err) {
      checks.onemapTokenService.status = 'unreachable';
      checks.onemapTokenService.latencyMs = Date.now() - omStart;
      checks.onemapTokenService.message = err.message || 'Timeout';
    }
  } else {
    checks.onemapTokenService.status = 'configuration_missing';
    checks.onemapTokenService.message = 'ONEMAP_EMAIL and ONEMAP_PASSWORD not configured';
  }

  // 3. Probe OneMap public search
  try {
    const sStart = Date.now();
    const searchHeaders = { 'User-Agent': 'Mozilla/5.0 OneMap-Health/1.0' };
    if (onemapToken) searchHeaders['Authorization'] = onemapToken;

    const res = await fetch(checks.onemapGeocodeSearch.endpoint, {
      headers: searchHeaders,
      signal: AbortSignal.timeout(6000),
    });
    checks.onemapGeocodeSearch.latencyMs = Date.now() - sStart;
    if (res.ok) {
      const json = await res.json();
      checks.onemapGeocodeSearch.status = 'healthy';
      checks.onemapGeocodeSearch.message = `Geocode search operational (${json.results ? json.results.length : 0} results)`;
    } else {
      checks.onemapGeocodeSearch.status = 'degraded';
      checks.onemapGeocodeSearch.message = `HTTP ${res.status} (OneMap requires authenticated token)`;
    }
  } catch (err) {
    checks.onemapGeocodeSearch.status = 'unreachable';
    checks.onemapGeocodeSearch.message = err.message || 'Timeout';
  }

  // Probe remaining endpoints status
  checks.uraResidentialTransactions.status = uraToken ? 'healthy' : isUraConfigured ? 'skipped_no_token' : 'configuration_missing';
  checks.uraResidentialTransactions.message = uraToken ? 'Operational' : 'Awaiting valid URA token';

  checks.uraCarparkAvailability.status = uraToken ? 'healthy' : isUraConfigured ? 'skipped_no_token' : 'configuration_missing';
  checks.uraCarparkAvailability.message = uraToken ? 'Operational' : 'Awaiting valid URA token';

  checks.uraCarparkDetails.status = uraToken ? 'healthy' : isUraConfigured ? 'skipped_no_token' : 'configuration_missing';
  checks.uraCarparkDetails.message = uraToken ? 'Operational' : 'Awaiting valid URA token';

  checks.onemapReverseGeocode.status = onemapToken ? 'healthy' : isOnemapConfigured ? 'skipped_no_token' : 'configuration_missing';
  checks.onemapReverseGeocode.message = onemapToken ? 'Operational' : 'Requires 3-day OneMap token';

  checks.onemapRouting.status = onemapToken ? 'healthy' : isOnemapConfigured ? 'skipped_no_token' : 'configuration_missing';
  checks.onemapRouting.message = onemapToken ? 'Operational' : 'Requires 3-day OneMap token';

  const totalDuration = Date.now() - startTime;
  const mem = process.memoryUsage();

  return {
    status: (isUraConfigured && checks.uraTokenService.status === 'healthy') || (isOnemapConfigured && checks.onemapTokenService.status === 'healthy') ? 'operational' : 'standby',
    timestamp: new Date().toISOString(),
    totalDurationMs: totalDuration,
    system: {
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        rssMb: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
        heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
      },
    },
    credentials: {
      uraConfigured: isUraConfigured,
      hasUraToken: Boolean(uraToken),
      onemapConfigured: isOnemapConfigured,
      hasOnemapToken: Boolean(onemapToken),
    },
    services: checks,
  };
}

export default async function healthHandler(req, res) {
  try {
    const report = await checkApiHealth();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message || 'Health check failed',
    });
  }
}
