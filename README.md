# " Bon Voyage "

Bon Voyageは旅行の予定を立てるときに役立つwebアプリです。
オフラインで誰かと地図を広げながら旅行計画を練る、それをオンライン上で出来たらいいなと思い作りました。
旅行好きな方、これから旅行する方のお役に立てたら嬉しいです。
 
# 画像
 ![toppage](https://user-images.githubusercontent.com/60009393/83129635-0b5aab80-a118-11ea-8e9c-b5c9315e7bd4.png)
トップページの画像です。

![スクリーンショット (105)](https://user-images.githubusercontent.com/60009393/84588136-bdf07500-ae5f-11ea-9c39-4d0ad8f036a0.png)

トップページがフェードアウトすると検索＆地図画面がフェードインしてきます。

![スクリーンショット (106)](https://user-images.githubusercontent.com/60009393/84588156-dfe9f780-ae5f-11ea-9a4d-a3526080259a.png)
地図上のピンをクリックすると詳細を見ることができます。

行きたい場所は☆マークををクリックするとTogoリストに追加されます。画面上のハンバーガーメニューからTogo listに飛ぶと

![スクリーンショット (108)](https://user-images.githubusercontent.com/60009393/84588238-a2399e80-ae60-11ea-8758-80476f07c297.png)

自分がリストに追加した場所だけが表示される地図とリストが表示されます。
画面上の共有ボダンからURLコピーやTwitter,LINEで共有が出来ます。
# 概要と特徴
 
検索ワードを投げると一致する場所が検索結果一覧に表示されます。(固有名詞でも「パリ　カフェ」などの調べ方も可)
行きたいと思ったところは☆マークをクリックすると「ToGoリスト」に追加されます。
ハンバーガーメニューからTogoリストを開くと行くところの一覧とそこにだけピンが落ちた状態の地図が表示されるので、行くところの位置関係が分かりやすく旅程を立てるときに便利です。
(位置関係によって行く順番が変わったり、一か所だけ離れていれば行くところから外したり…などがあると思うので)
また、URLをコピーしたりTwitter,LINEで共有できるので、一緒に旅行する人と旅行の予定を立てるときにスムーズになります。
LocalStorageを使っているのでアクセスしたユーザーごとに各々のリストが作成可能で、それぞれの行きたい場所を持ち寄って旅行計画を練ることができます。
共有されたリストは、リスト所持者が場所の追加や削除を行うと、共有された見てる側のリストにもリアルタイムに反映・表示されます。(ここが面白いポイントだと思うので、ぜひ誰かと共有しながら試してみてください！)


# 使っている技術
HTML&CSS,
JavaScript,
jquery-3.4.1,
bootstrap-4.3.1,
Vue.js,
Google Maps API,
Firebase
 

# 使い方
 
 行きたい場所を検索する(固有名詞でも、「パリ　カフェ」という調べ方でも可),
 行く予定の場所の横の☆マークをクリックしてTogoリストに追加,
 ToGoリストを開いて見る,
 共有したい場合はURLをコピーしたりTwitter,LINEで共有すると他の人も閲覧できる
 

# 作成者
 
* 久光未悠
* WantedlyのURL　https://www.wantedly.com/users/112556973
 
