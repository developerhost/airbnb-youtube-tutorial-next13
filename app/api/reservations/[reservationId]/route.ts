// reservationIdを指定して予約を削除するAPI

// Next.jsのNextResponseをインポート
import { NextResponse } from "next/server";
// Prismaをインポート
import prisma from "@/app/libs/prismadb";
// httpモジュールのgetメソッドをインポート
import { get } from "http";
// getCurrentUser関数をインポート
import getCurrentUser from "@/app/actions/getCurrentUser";

// IParamsインターフェースを作成
interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request, // リクエスト情報
  { params }: { params: IParams } // パラメーター
) {
  // ユーザー情報を取得する
  const currentUser = await getCurrentUser();

  // ユーザーが存在しない場合はエラーを返す
  if (!currentUser) {
    return NextResponse.error();
  }

  // paramsからreservationIdを取得する
  const { reservationId } = params;

  // reservationIdが存在しないまたは文字列ではない場合はエラーをスローする
  if (!reservationId || typeof reservationId !== "string") {
    throw new Error("Invalid reservationId");
  }

  // Prismaを使って予約を削除する
  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId, // reservationIdが一致する
      OR: [ // 以下の条件のいずれかに一致する
        { userId: currentUser.id }, // ユーザーIDが一致する
        { listing: { userId: currentUser.id } } // リスティングのユーザーIDが一致する
      ]
    }
  });

  // 削除された予約をJSON形式で返す
  return NextResponse.json(reservation)
}