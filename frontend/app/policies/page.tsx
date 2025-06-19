'use client';
import PageWrapper from '@/components/PageWrapper';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';
import { sdk } from '@/lib/sdk';
import { toast } from 'sonner';
const Monaco = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function PoliciesPage() {
  const { data } = sdk.usePolicies__getQuery();
  async function save(kind: string, content: string) {
    await sdk.policies__put(kind, { content });
    toast.success('Published');
  }
  return (
    <PageWrapper>
      <h1 className="text-lg font-medium mb-6">Policies</h1>
      <Tabs defaultValue="rules">
        <TabsList>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="opa">OPA bundles</TabsTrigger>
          <TabsTrigger value="threshold">Thresholds</TabsTrigger>
        </TabsList>

        {['rules', 'opa', 'threshold'].map(k => (
          <TabsContent key={k} value={k}>
            <Monaco
              defaultLanguage={k === 'opa' ? 'rego' : 'yaml'}
              defaultValue={data?.[k] ?? ''}
              height={400}
              onChange={v => save(k, v ?? '')}
            />
          </TabsContent>
        ))}
      </Tabs>
    </PageWrapper>
  );
}
