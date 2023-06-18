/*
このコードは、Reactアプリケーションで予約機能を提供するために使用される

- データを取得し、変換するためのPrismaにアクセスする
- 特定のカテゴリーを選択するためのナビゲーションバーの作成
- ログインモーダルの使用 (未ログインの場合に表示される)
- レンダリングされるリスト項目の詳細情報を管理する
- 指定された日付範囲に基づいて価格を計算する
*/

// 'use client' は 'use strict' の代わりに使われます。厳密なモードで実行されることを保証します。
'use client'

import { Reservation } from "@prisma/client";

import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { categories } from "@/app/components/navbar/Categories";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, differenceInDays, eachDayOfInterval, set, setDate } from "date-fns";
import axios from "axios";
import { toast } from "react-hot-toast";
import ListingReservation from "@/app/components/listings/ListingReservation";
import { Range } from "react-date-range";

// 初期の日付範囲を設定
const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection',
}

interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeListing & {
    user: SafeUser
  };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  // 予約済みの日付を無効にするための配列を作成
  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  // 予約を作成する関数
  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      loginModal.onOpen();
      return;
    }

    setIsLoading(true);

    axios.post('/api/reservations', {
      totalPrice,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      listingId: listing?.id,
    }).then(() => {
      toast.success('Reservation created successfully');
      setDateRange(initialDateRange);
      router.push('/trips')
      router.refresh();
    }).catch((err) => {
      toast.error(err.message);
    }
    ).finally(() => {
      setIsLoading(false);
    }
    )
  }, [
    currentUser,
    dateRange,
    totalPrice,
    listing?.id,
    loginModal,
  ]);

  // 日付範囲が変更された場合に価格を再計算する
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate,
      );

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  // リスト項目のカテゴリーを取得する
  const category = useMemo(() => {
    return categories.find((item) =>
      item.label === listing.category);
  }, [])

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead 
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div className="
            grid
            grid-cols-1
            md:grid-cols-7
            md:gap-10
            mt-6
          ">
            <ListingInfo 
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div
              className="
                order-first
                mb-10
                md:order-last
                md:col-span-3
              "
            >
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ListingClient
