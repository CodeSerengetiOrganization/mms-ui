import MachineFailureTabs from "@/components/machine-failure/MachineFailureTabs";

export default function MachineFailureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="machine-failure-container flex flex-col">
      <MachineFailureTabs />
      <div className="tab-content flex-1 overflow-auto">{children}</div>
    </div>
  );
}
