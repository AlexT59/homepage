import { useTranslation } from "next-i18next"; 

import Container from "components/services/widget/container"; 
import Block from "components/services/widget/block"; 
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;  

  const { data: dashData, error: dashError } = useWidgetAPI(widget, "dashboard");
  const { data: payoutData, error: payoutError } = useWidgetAPI(widget, "payout");
  const { data: satelData, error: satelError } = useWidgetAPI(widget, "satellites");

  if (dashError) {
    return <Container service={service} error={dashError} />;
  }
  if (payoutError) {
    return <Container service={service} error={payoutError} />;
  }
  if (satelError) {
    return <Container service={service} error={satelError} />;
  }

  if (!dashData || !payoutData || !satelData) {
    return (
      <Container service={service}>
        <Block label="storjnode.monthearn"/>
        <Block label="storjnode.monthbandwidthusage"/>
        <Block label="storjnode.diskusage"/>
        <Block label="storjnode.onlinescore"/>
      </Container>
    );
  }

  const diskUsage = dashData.diskSpace.used / dashData.diskSpace.available * 100;
  let diskUsageStr = `${t("common.bytes", { value: dashData.diskSpace.used, decimals: 0 })}`;
  diskUsageStr += ` (${t("common.percent", { value: diskUsage })})`;

  const monthPayout = (payoutData.currentMonth.held + payoutData.currentMonth.payout) / 100;

  let onlineScore = 0;
  satelData.audits.forEach((sat) => {
    onlineScore += sat.onlineScore;
  });
  // take the floor bc if availability is not 100%, we want to see it
  onlineScore = Math.floor((onlineScore / satelData.audits.length) * 100 * 10) / 10;

  return (
    <Container service={service}>
      <Block
        label="storjnode.monthearn"
        value={`$${t("common.number", {
          value: monthPayout,
          decimals: 2,
        })}`}
      />
      <Block
        label="storjnode.monthbandwidthusage"
        value={t("common.bytes", {
          value: dashData.bandwidth.used,
          maximumFractionDigits: 1,
        })}
      />
      <Block
        label="storjnode.diskusage"
        value={ diskUsageStr }
      />
      <Block
        label="storjnode.onlinescore"
        value={t("common.percent", {
          value: onlineScore,
          maximumFractionDigits: 1,
        })}
      />
    </Container>
  );
}
