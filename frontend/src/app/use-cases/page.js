import UseCasesContent from '@/components/useCases/useCasesContent';

export const metadata = {
  title: 'Use Cases - FashionX',
  description: 'Discover how FashionX can transform your visual content strategy with AI-generated fashion photography',
};

export default function UseCasesPage() {
  return (
    <main className="min-h-screen">
      <UseCasesContent />
    </main>
  );
}