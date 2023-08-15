/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies.
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import Circle from '../circle';

interface MatrixComponentProps {
  color: string;
  title: string;
  description?: string;
  count: number;
  isExpanded?: boolean;
  textClassName: string;
  containerClasses: string;
}

const MatrixComponent = ({
  color,
  title,
  description = '',
  count,
  isExpanded = false,
  textClassName,
  containerClasses,
}: MatrixComponentProps) => {
  const countClasses = classNames(textClassName, 'text-xl2 leading-none');

  return (
    <div className={containerClasses}>
      <div className="flex gap-x-4">
        <Circle color={color} />
        <div className="lg:max-w-[80%] lg:mr-8">
          <h4 className="-mt-[3px] mb-1.5 text-xs">{title}</h4>
          <div className={countClasses}>{count}</div>
          {description && isExpanded && (
            <p className="text-xs mt-1.5">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatrixComponent;
