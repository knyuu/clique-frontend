export default function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white">
            <h1 className="text-9xl font-black text-slate-800">404</h1>
            <p className="text-slate-400 mt-4">Trang bạn tìm kiếm không tồn tại.</p>
            <a href="/login" className="btn btn-primary mt-6">Quay lại Đăng nhập</a>
        </div>
    )
}