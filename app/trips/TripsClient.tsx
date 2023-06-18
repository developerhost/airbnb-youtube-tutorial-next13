'use client'

// nextjsナビゲーションのuseRouterをインポート
import { useRouter } from "next/navigation";

// コンポーネントおよび型のインポート
import Container from "../components/Container";
import Heading from "../components/Heading";
import { SafeReservation, SafeUser } from "../types";

// react hooksとaxios/react-hot-toastのインポート
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";

// TripsClientPropsインターフェースの定義
interface TripsClientProps {
  reservations?: SafeReservation[];
  currentUser?: SafeUser | null;
}

// TripsClientコンポーネントの定義開始
const TripsClient: React.FC<TripsClientProps> = ({
  reservations,
  currentUser,
}) => {
  // useRouterのインスタンス化
  const router = useRouter();
  // 削除中の予約IDを保持するstate
  const [deletingId, setDeletingId] = useState('');

  // キャンセルボタンをクリックしたときの処理
  const onCancel = useCallback((id: string) => {
    // 削除中の予約IDを更新
    setDeletingId(id);

    // APIから予約をキャンセル
    axios.delete(`/api/reservations/${id}`)
      .then(() => {
        // 正常にキャンセルされた場合はトースト通知を表示してページをリフレッシュ
        toast.success('Reservation cancelled');
        router.refresh();
      })
      .catch((error) => {
        // エラーが発生した場合はエラーメッセージをトースト通知で表示
        toast.error(error?.response?.data?.error);
      })
      .finally(() => {
        // 削除中の予約IDをクリア
        setDeletingId('');
      })
  }, [router])

  // JSXの描画
  return (
    <Container>
      <Heading 
        title="Trips"
        subtitle="Your trips"
      />
      <div className="
        mt-10
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-6
        gap-8
      ">
        {reservations?.map((reservation) => (
          <ListingCard 
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  )
}

// TripsClientコンポーネントのエクスポート
export default TripsClient
