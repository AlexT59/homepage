import { useTranslation } from "next-i18next"; 

import Container from "components/services/widget/container"; 
import Block from "components/services/widget/block"; 
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;  

  const { data: dashData, error: dashError } = useWidgetAPI(widget, "dashboard");
  const { data: payoutData, error: payoutError } = useWidgetAPI(widget, "payout");

  if (dashError) {
    return <Container service={service} error={dashError} />;
  }
  if (payoutError) {
    return <Container service={service} error={payoutError} />;
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
    </Container>
  );
}
