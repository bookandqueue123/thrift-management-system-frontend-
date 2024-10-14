"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import PhotoEditor from "@/modules/merchant/PhotoEditor";

export default function Page() {
  return (
    <>
      <ProtectedRoute requireAIPhotoEditor>
        <PhotoEditor />;
      </ProtectedRoute>
    </>
  );
}
