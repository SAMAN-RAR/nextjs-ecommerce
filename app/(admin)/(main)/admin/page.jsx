import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatter";

const getSalesData = async () => {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  };
};

const getUserData = async () => {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  };
};

const getProductData = async () => {
  const [activeCount, inActiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return {
    activeCount,
    inActiveCount,
  };
};

const AdminPage = async () => {
  const [
    { amount, numberOfSales },
    { userCount, averageValuePerUser },
    { activeCount, inActiveCount },
  ] = await Promise.all([getSalesData(), getUserData(), getProductData()]);
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(numberOfSales)} orders`}
        body={formatCurrency(amount)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${formatCurrency(averageValuePerUser)} average value`}
        body={formatNumber(userCount)}
      />
      <DashboardCard
        title="Active Products"
        subtitle={`${formatNumber(inActiveCount)} Inactive`}
        body={formatNumber(activeCount)}
      />
    </div>
  );
};
export default AdminPage;

const DashboardCard = ({ title, subtitle, body }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
};
