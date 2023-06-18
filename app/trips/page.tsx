// EmptyStateコンポーネントとClientOnlyコンポーネントをインポート
import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

// getCurrentUser関数とgetReservations関数をインポートし、TripsClientクラスをインポート
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import TripsClient from "./TripsClient";

// date-fnsのロケールをドイツに設定
import { de } from "date-fns/locale";

// TripsPage関数を宣言してエクスポート
const TripsPage = async () => {
  // currentUserにログイン中のユーザーを取得
  const currentUser = await getCurrentUser();

  // ログインしていない場合は、EmptyStateコンポーネントとClientOnlyコンポーネントを返す
  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState 
          title="Unauthorized"
          subtitle="Please login"
        />
      </ClientOnly>
    )
  }

  // currentUserの予約情報を取得
  const reservations = await getReservations({
    userId: currentUser.id,
  });

  // 予約がない場合は、EmptyStateコンポーネントとClientOnlyコンポーネントを返す
  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState 
          title="No reservations"
          subtitle="You have no reservations"
        />
      </ClientOnly>
    )
  }

  // 予約情報をTripsClientコンポーネントとClientOnlyコンポーネントで返す
  return (
    <ClientOnly>
      <TripsClient 
        reservations={reservations}
        currentUser={currentUser}
      />
    </ClientOnly>
  )
}

// TripsPage関数をデフォルトエクスポート
export default TripsPage
