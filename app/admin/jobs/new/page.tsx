import JobForm from "@/components/admin/JobForm";

export default function NewJobPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-primary mb-8">New job</h1>
      <JobForm />
    </div>
  );
}
