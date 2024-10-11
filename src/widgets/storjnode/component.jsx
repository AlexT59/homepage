import { useTranslation } from "next-i18next"; 

import Container from "components/services/widget/container"; 
import Block from "components/services/widget/block"; 
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;  

  const { data: dashData, error: dashError } = useWidgetAPI(widget, "dashboard");
  const { data: payoutData, error: payoutError } = useWidgetAPI(widget, "payout");
  const { data: satelData, error satelError } = useWidgetAPI(widget, "satellites");

  if (dashError) {
    return <Container service={service} error={dashError} />;
  }
  if (payoutError) {
    return <Container service={service} error={payoutError} />;
  }
  if (satelError) {
    return <Container service={service} error={satelError} />;
  }

  if (!dashData || !payoutData) {
    return (
      <Container service={service}>
        <Block label="storjnode.monthearn" />
      </Container>
    );
  }

  const diskUsage = dashData.diskSpace.available / dashData.diskSpace.used
  const monthPayout = (payoutData.currentMonth.held + payoutData.currentMonth.payout) / 100
  const onlineScore = 0
  satelData.forEach(function (sat, index) {
    onlineScore += sat.onlineScore
  });
  onlineScore /= satelData.length

  return (
    <Container service={service}>
      <Block
        label="storjnode.monthearn"
        value={t("common.number", {
          value: monthPayout,
          decimals: 2,
        })}
      />
      <Block
        label="storjnode.diskusage"
        value={t("common.percent", {
          value: diskUsage,
        })}
      />
      <Block
        label="storjnode.bandwidthusage"
        value={t("common.bytes", {
          value: dashData.bandwidth.used,
          maximumFractionDigits: 1,
        })}
      />
      <Block
        label="storjnode.onlinescore"
        value={t("common.percent", {
          value: onlineScore,
        })}
      />
    </Container>
  );
}
