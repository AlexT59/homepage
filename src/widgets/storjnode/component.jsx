import { useTranslation } from "next-i18next"; 

import Container from "components/services/widget/container"; 
import Block from "components/services/widget/block"; 
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;  

  const { data: payoutData, error: payoutError } = useWidgetAPI(widget, "payout");

  if (payoutError) {
    return <Container service={service} error={payoutError} />;
  }

  if (!payoutData) {
    return (
      <Container service={service}>
        <Block label="storjnode.monthearn" />
      </Container>
    );
  }

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
    </Container>
  );
}
