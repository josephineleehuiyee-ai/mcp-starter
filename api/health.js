/**
 * URA DataService API Health Monitor
 * Route: GET /api/health
 * 
 * Verifies and monitors:
 * 1. Server Uptime, Memory, and Node.js Runtime
 * 2. URA_ACCESS_KEY configuration
 * 3. Daily Token Generation Endpoint (insertNewToken/v1)
 * 4. Residential Transactions Service (PMI_Resi_Transaction)
 * 5. Car Park Availability Service (Car_Park_Availability)
 * 6. Car Park Details Service (Car_Park_Details)
 */

export async function checkApiHealth() {
  const startTime = Date.now();
  const accessKey = process.env.URA_ACCESS_KEY;
  const isKeyConfigured = Boolean(accessKey && accessKey !== 'MY_URA_ACCESS_KEY');

  const checks = {
    tokenService: {
      endpoint: 'https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1',
      status: 'untested',
      latencyMs: null,
      message: null,
    },
    residentialTransactions: {
      endpoint: 'https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=1',
      status: 'untested',
      latencyMs: null,
      message: null,
    },
    carparkAvailability: {
      endpoint: 'https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=Car_Park_Availability',
      status: 'untested',
      latencyMs: null,
      message: null,
    },
    carparkDetails: {
      endpoint: 'https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=Car_Park_Details',
      status: 'untested',
      latencyMs: null,
      message: null,
    },
  };

  let token = null;

  // 1. Probe Token Generation Service if AccessKey is available
  if (isKeyConfigured && accessKey) {
    const tokenStart = Date.now();
    try {
      const res = await fetch(checks.tokenService.endpoint, {
        method: 'GET',
        headers: {
          'AccessKey': accessKey,
          'User-Agent': 'Mozilla/5.0 URA-HealthMonitor/1.0',
        },
        signal: AbortSignal.timeout(6000),
      });

      checks.tokenService.latencyMs = Date.now() - tokenStart;

      if (res.ok) {
        const json = await res.json();
        if (json.Status === 'Success' && json.Result) {
          checks.tokenService.status = 'healthy';
          checks.tokenService.message = 'Daily token generated successfully';
          token = json.Result;
        } else {
          checks.tokenService.status = 'degraded';
          checks.tokenService.message = json.Message || `API returned status: ${json.Status}`;
        }
      } else {
        checks.tokenService.status = 'unhealthy';
        checks.tokenService.message = `HTTP ${res.status} ${res.statusText}`;
      }
    } catch (err) {
      checks.tokenService.status = 'unreachable';
      checks.tokenService.latencyMs = Date.now() - tokenStart;
      checks.tokenService.message = err.message || 'Connection timeout';
    }
  } else {
    checks.tokenService.status = 'configuration_missing';
    checks.tokenService.message = 'URA_ACCESS_KEY is not configured in environment variables.';
  }

  // 2. Probe Data Services if Token was obtained, otherwise check connectivity
  const probeDataEndpoint = async (serviceName, endpointKey, extraParam = '') => {
    const url = `https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=${serviceName}${extraParam}`;
    const start = Date.now();

    if (!token || !accessKey) {
      checks[endpointKey].status = isKeyConfigured ? 'skipped_no_token' : 'configuration_missing';
      checks[endpointKey].message = isKeyConfigured
        ? 'Skipped because token could not be obtained'
        : 'Requires valid URA_ACCESS_KEY to invoke service';
      return;
    }

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'AccessKey': accessKey,
          'Token': token,
          'User-Agent': 'Mozilla/5.0 URA-HealthMonitor/1.0',
        },
        signal: AbortSignal.timeout(6000),
      });

      checks[endpointKey].latencyMs = Date.now() - start;

      if (res.ok) {
        const json = await res.json();
        if (json.Status === 'Success') {
          const count = Array.isArray(json.Result) ? json.Result.length : 0;
          checks[endpointKey].status = 'healthy';
          checks[endpointKey].message = `Operational (Returned ${count} records)`;
        } else {
          checks[endpointKey].status = 'degraded';
          checks[endpointKey].message = json.Message || `Returned status: ${json.Status}`;
        }
      } else {
        checks[endpointKey].status = 'unhealthy';
        checks[endpointKey].message = `HTTP ${res.status} ${res.statusText}`;
      }
    } catch (err) {
      checks[endpointKey].status = 'unreachable';
      checks[endpointKey].latencyMs = Date.now() - start;
      checks[endpointKey].message = err.message || 'Timeout connecting to URA';
    }
  };

  await Promise.all([
    probeDataEndpoint('PMI_Resi_Transaction', 'residentialTransactions', '&batch=1'),
    probeDataEndpoint('Car_Park_Availability', 'carparkAvailability'),
    probeDataEndpoint('Car_Park_Details', 'carparkDetails'),
  ]);

  const totalDuration = Date.now() - startTime;
  const mem = process.memoryUsage();

  return {
    status: isKeyConfigured && checks.tokenService.status === 'healthy' ? 'operational' : 'standby',
    timestamp: new Date().toISOString(),
    totalDurationMs: totalDuration,
    system: {
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        rssMb: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
        heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
        heapTotalMb: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
      },
    },
    credentials: {
      accessKeyConfigured: isKeyConfigured,
      hasActiveToken: Boolean(token),
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
