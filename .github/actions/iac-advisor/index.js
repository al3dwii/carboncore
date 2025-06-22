const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

async function run() {
  try {
    const carboncoreUrl = core.getInput('carboncore-url', { required: true });
    const carboncoreToken = core.getInput('carboncore-token', { required: true });
    const instanceType = core.getInput('instance-type');
    const regionCode = core.getInput('region');
    const kwh = parseFloat(core.getInput('kwh'));
    const co2 = parseFloat(core.getInput('co2'));
    const cost = parseFloat(core.getInput('usd'));

    const url = `${carboncoreUrl.replace(/\/$/,'')}/events/`;

    await axios.post(url, {
      project_id: github.context.repo.repo,
      feature: `PR#${github.context.issue.number}`,
      event_type_id: 'iac-scan',
      sku_id: instanceType,
      region: regionCode,
      kwh: kwh,
      co2: co2,
      usd: cost
    }, { headers: { 'X-Project-Token': carboncoreToken }});

    core.info('Event sent to CarbonCore');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
