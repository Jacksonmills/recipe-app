'use client';

import { RecipeCard } from '@/components/recipe-card';
import { experimental_useObject as useObject } from 'ai/react';

import InputField from '@/components/form/input-field';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RecipeSchema } from '@/lib/recipe-schema';
import { Loader } from 'lucide-react';
import { z } from 'zod';

const schema = z.object({
  prompt: z.string().min(1),
});

export default function VercelAiStreamingPage() {
  const { object, submit, isLoading } = useObject({
    schema: RecipeSchema,
    api: '/vercel-ai-streaming/api',
  });

  const onSubmit = ({
    prompt,
  }: {
    prompt: z.infer<typeof schema>['prompt'];
  }) => {
    submit({ prompt });
  };

  return (
    <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
      <ScrollArea
        style={{
          height: 'calc(100vh - (121px))',
        }}
      >
        <div className="px-4 pt-12 pb-20">
          <RecipeCard recipe={object} />
        </div>
      </ScrollArea>

      {!object && (
        <div
          className="p-20"
          style={{
            height: 'calc(100vh - (121px))',
          }}
        >
          <div className="flex items-center justify-center h-full border border-dashed flex-col text-token-text-primary">
            <p className="text-lg text-gray-500">
              Enter a prompt to generate a recipe
            </p>
          </div>
        </div>
      )}

      <div
        className="bg-gradient-to-t to-10% from-background/75 to-transparent pointer-events-none z-20"
        style={{
          height: 'calc(100vh - (121px))',
        }}
      />

      <div className="grid place-content-end justify-stretch">
        <hr className="border-t border" />
        <Form
          schema={schema}
          onSubmit={onSubmit}
          resetOnSuccess
          className="grid [&>*]:col-start-1 [&>*]:row-start-1 bg-background p-4"
        >
          <div className="pt-5">
            <InputField
              name="prompt"
              label="Prompt:"
              placeholder="What recipe do you want?"
            />
          </div>
          <div className="grid place-content-end pointer-events-none py-1 px-3 border border-transparent">
            {isLoading && <Loader className="animate-spin-slow" />}
          </div>
        </Form>
      </div>
    </div>
  );
}
