"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import PhotoEditor from "@/modules/merchant/PhotoEditor";

export default function Page() {
  return (
    <div>
      <div className="mt-8">
        <ProtectedRoute requireAIPhotoEditor>
          <PhotoEditor />
        </ProtectedRoute>
      </div>
    </div>
  );
}
