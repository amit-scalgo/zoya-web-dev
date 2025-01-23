import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp({ open, setOpen }) {
  const navigate = useNavigate();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex !max-w-sm flex-col items-center">
        <DialogHeader>
          <DialogTitle className="mb-4 text-center text-xl">
            Verify OTP
          </DialogTitle>
          <DialogDescription className="pb-5 text-center">
            Enter the OTP sent to your device. Ensure you input the code
            correctly to proceed.
          </DialogDescription>
        </DialogHeader>
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button
          onClick={() => navigate("/auth/login")}
          className="bg-zoyaprimary/80 mt-7 min-h-11 min-w-52 font-bold"
        >
          Verify
        </Button>
      </DialogContent>
    </Dialog>
  );
}
