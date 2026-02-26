## Mini Dating App – Clique83 Test

Prototype mini dating app fullstack (MERN) được xây dựng để hoàn thành bài test Web Developer Intern của Clique83.  
Ứng dụng cho phép người dùng tạo profile, like nhau để tạo **match**, sau đó chọn **availability trong 3 tuần tới** và hệ thống tự tìm **slot thời gian trùng nhau đầu tiên** cho buổi hẹn.

---

## 1. Tech stack & kiến trúc

- **Frontend**
  - `React + Vite`, `react-router-dom`
  - UI với `Tailwind CSS` + `daisyUI` + `react-icons`
  - Giao tiếp backend qua `axios` (`src/utils/axios.js`)
- **Backend**
  - `Node.js`, `Express`
  - `MongoDB` + `Mongoose` cho database
  - Auth với `JWT` (cookie HTTP-only), `bcryptjs`
  - Upload & lưu ảnh qua `multer` + `cloudinary`
  - Gửi email OTP / welcome bằng `nodemailer` / `resend` (trong thư mục `src/email`)

Repo được chia thành 2 phần:

- `clique-frontend`: ứng dụng React (Vite)
- `clique-backend`: API server (Express + MongoDB)

---

## 2. Cách chạy dự án local

### Backend

1. Vào thư mục backend:
   ```bash
   cd clique-backend
   npm install
   ```
2. Tạo file `.env` (tối thiểu):
   ```bash
   MONGO_URI=<chuỗi kết nối MongoDB>
   JWT_SECRET=<secret bất kỳ>
   CLIENT_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   EMAIL_FROM=...
   EMAIL_TRANSPORT_CONFIG=...
   ```
3. Chạy server:
   ```bash
   npm run dev
   ```
4. Mặc định API chạy tại: `http://localhost:3000` (hoặc port bạn cấu hình trong `src/server.js`).

### Frontend

1. Vào thư mục frontend:
   ```bash
   cd clique-frontend
   npm install
   ```
2. Đảm bảo `src/utils/axios.js` đang trỏ đúng baseURL tới backend, ví dụ:
   ```js
   const api = axios.create({
     baseURL: "http://localhost:5000/api",
     withCredentials: true,
   });
   ```
3. Chạy dev server:
   ```bash
   npm run dev
   ```
4. Mặc định frontend chạy tại: `http://localhost:5173`.

---

## 3. Cách lưu data (theo yêu cầu bài test)

Ứng dụng sử dụng **backend + MongoDB** để lưu toàn bộ dữ liệu:

- **User** (`src/models/User.js`)
  - Các trường chính: `name`, `email`, `password`, `age`, `gender`, `city`, `genderPreference`, `avatar`, `bio`, `isActivated`, `hasCompletedOnboarding`, ...
  - Có index theo `city`, `gender`, `age` để sau này có thể tối ưu gợi ý.
- **Like** (`src/models/Like.js`)
  - Lưu các **tương tác like một chiều**: `fromUserId` → `toUserId`.
  - Ràng buộc unique `(fromUserId, toUserId)` để tránh like trùng.
- **Match** (`src/models/Match.js`)
  - Lưu cặp user đã **mutual like**: `userA`, `userB`.
  - Các trạng thái: `waiting_for_userA`, `waiting_for_userB`, `scheduled`, `no_common_slot`, `expired`.
  - Trường `finalSlot` chứa kết quả slot hẹn cuối cùng (start, end).
  - `expiresAt` để set TTL khi match chờ quá lâu.
- **Availability** (`src/models/Availability.js`)
  - Lưu **các slot rảnh** của từng user trong một match: `matchId`, `userId`, `slots[]`.
  - Mỗi `slot` là `{ start: Date, end: Date }`.
  - Ràng buộc unique `(matchId, userId)` để mỗi người chỉ có một bản ghi availability cho 1 match.

Nhờ sử dụng backend + MongoDB, toàn bộ profile, like, match và slot hẹn **không mất khi reload**.

---

## 4. Luồng tính năng chính

### 4.1. Tạo profile (PHẦN A)

- **Đăng ký & OTP**
  - API đăng ký: `authController.register`
    - Nhận `name`, `email`, `password`.
    - Hash password bằng `bcrypt`.
    - Tạo `activationToken` (OTP 6 số) + `activationTokenExpires` (15 phút).
    - Gửi email OTP qua `mailService.sendActivationEmail`.
    - Sinh JWT lưu ở HTTP-only cookie.
  - API xác thực OTP: `authController.verifyOTP`
    - Check `email`, `otp` khớp và còn hạn.
    - Set `isActivated = true`, xóa token & expiry.
    - Gửi email chào mừng (`sendWelcomeEmail`).

- **Hoàn thiện hồ sơ / Profile Setup**
  - Frontend page: `ProfileSetup.jsx`
    - Gọi `authApi.getMe()` để load dữ liệu user hiện tại.
    - Cho user nhập:
      - Tên (`name`)
      - Tuổi (`age`)
      - Thành phố (`city`)
      - Giới tính (`gender`)
      - Sở thích giới tính (`genderPreference`)
      - Bio / mô tả ngắn (`bio`)
      - Ảnh đại diện (`avatar`)
    - Có **validation phía client**:
      - Name ≥ 2 ký tự
      - Age là số, 18–100
      - City không trống
      - Bio ≥ 10 ký tự
      - Bắt buộc có avatar (tự upload hoặc dùng avatar random khi đăng ký).
  - Backend: `userController.updateUserProfile`
    - Kiểm tra đầy đủ các field bắt buộc, validate độ dài name/bio, tuổi ≥ 18.
    - Validate có avatar (avatar cũ hoặc file upload mới).
    - Lưu thông tin vào MongoDB, set `hasCompletedOnboarding = true`.

→ Như vậy **profile** gồm: tên, tuổi, giới tính, bio, email (định danh), thành phố, giới tính mong muốn và avatar, được lưu trong MongoDB và tái sử dụng trên toàn app.

---

### 4.2. Hiển thị danh sách profile & Like (PHẦN B)

- **Hiển thị danh sách profile**
  - Frontend page: `Home.jsx`
    - Gọi API `GET /home` (qua `api.get("/home")`) để lấy list user gợi ý.
    - Mỗi user được render qua `UserCard` / `UserDetailPopup` với avatar, tên, tuổi, bio, ...
    - Có **loading state** khi đang fetch dữ liệu.

- **Nút Like & Logic tạo Like**
  - Từ `Home.jsx`, khi bấm Like:
    ```js
    const res = await api.post("/matches/toggle-like", { toUserId: userId });
    ```
  - Backend: `matchController.toggleLike` (phiên bản chính dùng trong Matches & lịch hẹn)
    - Input: `fromUserId` (từ JWT), `toUserId` (body).
    - Nếu đã tồn tại `Like { fromUserId, toUserId }`:
      - Xóa like → trả về `{ isLiked: false, isMatch: false }`.
    - Nếu chưa có:
      - Tạo bản ghi `Like`.
      - Kiểm tra **mutual like**:
        ```js
        const mutualLike = await Like.findOne({ fromUserId: toUserId, toUserId: fromUserId });
        ```
      - Nếu **chưa mutual** → trả về `{ isLiked: true, isMatch: false }`.

---

### 4.3. Logic Match: “It’s a Match”

Khi **User A Like User B** *và* **User B Like User A**, backend sẽ:

1. Sắp xếp ID để chuẩn hóa cặp:
   ```js
   const [userA, userB] = [fromUserId, toUserId].sort();
   ```
2. Xác định ai là người vừa Like (trigger user) để set trạng thái đúng:
   ```js
   const triggerUser = fromUserId === userA.toString() ? "userA" : "userB";
   const initialStatus = triggerUser === "userA" ? "waiting_for_userB" : "waiting_for_userA";
   ```
3. Tạo hoặc update bản ghi `Match`:
   ```js
   const match = await Match.findOneAndUpdate(
     { userA, userB },
     {
       status: initialStatus,
       expiresAt: new Date(Date.now() + 48 * 3600000) // TTL 48h
     },
     { upsert: true, new: true }
   );
   ```
4. Xóa các bản ghi Like một chiều của cặp này để tránh trùng.
5. Trả về cho frontend:
   ```json
   { "isLiked": true, "isMatch": true, "matchId": "<id>" }
   ```

Frontend:
- Ở `Home.jsx`, nếu `isMatch === true`:
  - Hiển thị alert: *"Tuyệt vời! Hai bạn đã Match. Hãy chọn lịch rảnh để gặp nhau!"*
- Ngoài ra, tab `Matches` cho phép user quản lý:
  - `Upcoming` (lịch đã chốt)
  - `Action Required` (người đã like mình, cần quyết định)
  - `Pending` (mình đã like người khác, chờ phản hồi)

---

### 4.4. Chọn thời gian rảnh & tìm slot trùng (PHẦN C)

Sau khi Match, hai bên sẽ đi vào flow chọn thời gian rảnh.

#### 4.4.1. Lưu availability

- API: `matchController.submitAvailability`
  - Input:
    - `matchId`
    - `slots`: mảng các slot rảnh của user hiện tại, dạng:
      ```json
      [
        { "start": "2026-03-01T09:00:00.000Z", "end": "2026-03-01T11:00:00.000Z" },
        ...
      ]
      ```
  - Xử lý:
    - Kiểm tra `Match` tồn tại.
    - Lưu/ghi đè availability:
      ```js
      await Availability.findOneAndUpdate(
        { matchId, userId },
        { slots },
        { upsert: true }
      );
      ```
    - Cập nhật trạng thái match:
      - Nếu user hiện tại là `userA` → `status = 'waiting_for_userB'`
      - Ngược lại → `status = 'waiting_for_userA'`

→ Mỗi bên có thể chọn nhiều slot trong **3 tuần tới** (logic giới hạn 3 tuần có thể được đặt ở layer UI; backend chấp nhận bất kỳ Date hợp lệ).

#### 4.4.2. Logic tìm “first common slot”

- API: `matchController.finalizeMatch`
  - Input:
    - `matchId`
    - `slots`: danh sách slot mà **user hiện tại** vừa submit (cấu trúc giống trên).
  - Trước hết, server sẽ:
    - Lấy availability của **đối phương**:
      ```js
      const partnerAvail = await Availability.findOne({ matchId, userId: { $ne: myId } });
      if (!partnerAvail) return res.status(400).json({ message: "Đối phương chưa nộp lịch" });
      ```
  - Sau đó, chạy logic tìm slot trùng:
    ```js
    let commonSlot = null;
    const MIN_DURATION = 60 * 60 * 1000; // 1 giờ tối thiểu

    for (let sA of partnerAvail.slots) {
      for (let sB of mySlots) {
        const start = Math.max(new Date(sA.start), new Date(sB.start));
        const end = Math.min(new Date(sA.end), new Date(sB.end));

        if (end - start >= MIN_DURATION) {
          commonSlot = { start: new Date(start), end: new Date(end) };
          break;
        }
      }
      if (commonSlot) break;
    }
    ```
  - Đây chính là: **tìm slot trùng nhau đầu tiên** (theo thứ tự trong danh sách), với điều kiện độ dài slot chung ≥ 1 giờ.
  - Nếu **tìm được slot chung**:
    - Cập nhật `Match`:
      ```js
      match.status = "scheduled";
      match.finalSlot = commonSlot;
      match.expiresAt = undefined;
      ```
    - Trả về:
      ```json
      { "status": "success", "finalSlot": { "start": "...", "end": "..." } }
      ```
    - Frontend có thể hiển thị:  
      **“Hai bạn có date hẹn vào: [ngày] [giờ]”** (dựa trên format `fullDate` hiển thị ở `UpcomingDates.jsx`).
  - Nếu **không có slot trùng**:
    - Set `match.status = 'no_common_slot'`
    - Trả về:
      ```json
      { "status": "fail", "message": "Không tìm thấy giờ chung" }
      ```
    - Frontend sẽ báo lại user theo yêu cầu:  
      **“Chưa tìm được thời gian trùng. Vui lòng chọn lại.”**

#### 4.4.3. Hiển thị kết quả lịch hẹn

- Tab `Matches` → `Upcoming`:
  - Gọi API `GET /matches/my-dates`.
  - Backend: `matchController.getMyDates`
    - Lọc các `Match` có `status = 'scheduled'` và user là `userA` hoặc `userB`.
  - Frontend: `UpcomingDates.jsx` map dữ liệu thành các card timeline:
    - Dùng `item.fullDate`, `item.time`, `item.location`, `item.avatar`, `item.name` (được chuẩn hóa ở backend) để hiển thị lịch hẹn.

---

## 5. Các màn hình chính (Frontend)

- **Auth & Onboarding**
  - `Register.jsx`: đăng ký, gửi OTP.
  - `OtpVerification.jsx`: nhập mã OTP kích hoạt tài khoản.
  - `Login.jsx`: đăng nhập bằng email + password.
  - `ProfileSetup.jsx`: hoàn thiện hồ sơ lần đầu.
- **Dating flow**
  - `Home.jsx`: khám phá list profile, like / unlike, popup chi tiết user.
  - `Matches.jsx`: dashboard 3 tab:
    - `UpcomingDates.jsx`: lịch đã confirm.
    - `ActionRequired.jsx`: những người đã like mình, cần Like Back hoặc Reject.
    - `PendingThem.jsx`: những người mình đã like, đang chờ phản hồi.
  - `Profile.jsx`: trang profile cá nhân (hiện demo dữ liệu mock, UI cho phép chỉnh sửa thông tin).

---

## 6. UX, validation và edge cases đã xử lý

- **Validation phía backend**
  - Register: bắt buộc `name`, `email`, `password`, password ≥ 6 ký tự.
  - Update profile:
    - Bắt buộc các field name, bio, city, gender, genderPreference, age.
    - Name ≥ 2 ký tự, bio ≥ 10 ký tự.
    - Tuổi là số, ≥ 18.
    - Bắt buộc phải có avatar (cũ hoặc mới).
- **Validation phía frontend**
  - `ProfileSetup.jsx` kiểm tra:
    - Avatar bắt buộc.
    - Name, age, city, bio đúng format / độ dài.
- **Loading & empty states**
  - `Home.jsx`: loading khi fetch list user.
  - `Matches` các tab: loading spinner; `ActionRequired` hiển thị state “Quiet on the front” khi không có dữ liệu.
- **Logic edge case cho match**
  - Dùng sort `[userA, userB].sort()` để tránh duplicate match cặp A–B vs B–A.
  - TTL `expiresAt` cho match chờ lâu không chốt lịch.
  - Nếu đối phương chưa submit availability → `finalizeMatch` trả về message rõ ràng.

---

## 7. Nếu có thêm thời gian, tôi sẽ cải thiện gì?

- **1. Nâng cấp trải nghiệm chọn thời gian**
  - Xây dựng calendar UI trực quan (drag để chọn khoảng thời gian), giới hạn rõ ràng vào 3 tuần tới.
  - Hỗ trợ timezone, highlight slot trùng tiềm năng ngay khi chọn.
- **2. Gợi ý profile thông minh hơn**
  - Áp dụng scoring theo `city`, `genderPreference`, độ tuổi, tần suất online để ưu tiên hiển thị.
  - Thêm pagination / infinite scroll cho màn `Home`.

---

## 8. 1–3 tính năng đề xuất thêm & lý do

- **Safety Mode & Report / Block**
  - Cho phép user report / block người dùng khác.
  - Lý do: tăng độ an toàn, xây dựng môi trường hẹn hò lành mạnh hơn.
- **In-app Chat sau khi Match**
  - Khi `status = 'scheduled'` hoặc có `Match` thành công, mở room chat riêng cho 2 người.
  - Lý do: giữ người dùng trong hệ sinh thái, không phải chuyển qua app khác để nói chuyện.
- **Smart Reminder trước giờ hẹn**
  - Gửi email / notification nhắc cả hai người trước giờ hẹn (ví dụ 24h và 1h).
  - Lý do: giảm tỉ lệ “no-show”, tăng chất lượng buổi gặp và mức độ gắn bó với app.

---



