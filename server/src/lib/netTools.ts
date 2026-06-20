import axios from 'axios';
import { exec } from 'child_process';
import util from 'util';
import { LogSystem } from './LogSystem.js';

const execPromise = util.promisify(exec);

export async function netTestReport() {
    
    let report: Record<string, any> = {};

    try {
        // Test internet connectivity
        await axios.get('https://www.google.com', { timeout: 5000 });
        report.internetConnectivity = 'Online';
    } catch {
        report.internetConnectivity = 'Offline';
    }

    try {
        // Get public IP
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        report.publicIP = ipResponse.data.ip;
    } catch {
        report.publicIP = 'Unable to fetch';
    }

    try {
        // Test connection speed
        const speedTest = await execPromise('speedtest-cli --json');
        report.connectionSpeed = JSON.parse(speedTest.stdout);
    } catch {
        report.connectionSpeed = 'Speed test failed';
    }

    try {
        // Get network interface details
        const ifconfig = await execPromise('ifconfig');
        report.networkInterfaces = ifconfig.stdout;
    } catch {
        report.networkInterfaces = 'Unable to fetch network interfaces';
    }

    LogSystem.info(250407150759, `Network Test Report: ${JSON.stringify(report)}`, null);

    return report;
}
